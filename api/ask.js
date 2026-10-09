import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Runs on Vercel's servers. Secrets are read from server-side env vars and are
// never sent to the browser:
//   GEMINI_API_KEY            - Google AI Studio API key
//   FIREBASE_SERVICE_ACCOUNT  - Firebase service account JSON (optional; the
//                               cache is skipped when it isn't set)
//   GEMINI_MODEL              - optional override for the model id

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const DATABASE_URL = "https://can-my-cat-eat-xyz-v2-55578-default-rtdb.firebaseio.com";
const FALLBACK = "Oof. Sorry! Please try a different food.";
const MAX_WORD_LENGTH = 60;
const CACHE_TIMEOUT_MS = 2000;

// The database client retries forever when it can't connect, so cache calls
// are capped to keep a cache outage from hanging the search.
function withTimeout(promise) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Cache timed out")), CACHE_TIMEOUT_MS);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Answers are cached in the Realtime Database under answers/<food>. The admin
// SDK bypasses the database rules, so public reads/writes can stay locked.
function getCache() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return null;
    if (!getApps().length) {
        initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
            databaseURL: DATABASE_URL,
        });
    }
    return getDatabase().ref("answers");
}

// "  Dark  Chocolate " -> "dark chocolate". Database keys can't contain
// . $ # [ ] /, so those are percent-encoded.
function cacheKey(word) {
    return word
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[.$#[\]/%]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { word } = req.body || {};
    if (!word || typeof word !== "string" || !word.trim()) {
        return res.status(400).json({ error: "Missing 'word' in request body" });
    }
    if (word.length > MAX_WORD_LENGTH) {
        return res.status(200).json({ answer: FALLBACK });
    }

    const food = word.trim();
    const key = cacheKey(food);

    // A cache failure shouldn't break the search, so errors fall through to
    // the model.
    let cache = null;
    try {
        cache = getCache();
        if (cache) {
            const snapshot = await withTimeout(cache.child(key).get());
            if (snapshot.exists()) {
                return res.status(200).json({ answer: snapshot.val().answer, cached: true });
            }
        }
    } catch (err) {
        console.error("Cache read failed:", err);
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: `In general, can cats eat ${food}? Start your response with either "Yes." or "No.". Then, in 2-3 complete sentences, give a reason for why cats can or cannot eat ${food}. If you don't have an answer or the question doesn't make sense, then just return "${FALLBACK}".`,
        });
        const answer = response.text?.trim() || FALLBACK;

        // Only cache real answers, not the "try a different food" fallback.
        if (cache && /^(Yes|No)\./.test(answer)) {
            try {
                await withTimeout(cache.child(key).set({ food, answer, model: MODEL, createdAt: Date.now() }));
            } catch (err) {
                console.error("Cache write failed:", err);
            }
        }

        return res.status(200).json({ answer });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to get a response",
            detail: err?.message,
            status: err?.status,
        });
    }
}
