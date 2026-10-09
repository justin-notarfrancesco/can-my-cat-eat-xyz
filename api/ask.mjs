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

// Well-known dangers get a fixed answer instead of trusting the model (or a
// cached model answer) to get them right. Terms match as whole words, with an
// optional plural, so "garlic bread" matches but "grapefruit" doesn't.
const KNOWN_TOXIC = [
    {
        terms: ["lily", "lilies", "daylily", "daylilies"],
        answer: "No. Lilies are extremely toxic to cats, and even a small amount of pollen, a leaf, or water from the vase can cause sudden kidney failure. If your cat has touched or chewed a lily, take them to a vet immediately.",
    },
    {
        terms: ["onion", "garlic", "chive", "leek", "shallot", "scallion"],
        answer: "No. Onions, garlic, and related plants damage cats' red blood cells and can cause anemia. They are harmful raw, cooked, or powdered, including in sauces and seasonings.",
    },
    {
        terms: ["grape", "raisin", "currant", "sultana"],
        answer: "No. Grapes and raisins have been linked to kidney failure in pets, and it is not known how much is dangerous. It is safest to keep them away from cats completely.",
    },
    {
        terms: ["chocolate", "cocoa", "cacao"],
        answer: "No. Chocolate contains theobromine and caffeine, which are toxic to cats and can cause vomiting, a racing heart, tremors, and seizures. Darker chocolate is the most dangerous.",
    },
    {
        terms: ["coffee", "espresso", "caffeine", "energy drink"],
        answer: "No. Caffeine is toxic to cats and can cause restlessness, a rapid heartbeat, tremors, and seizures. Keep coffee, tea, energy drinks, and caffeine pills away from cats.",
    },
    {
        terms: ["alcohol", "beer", "wine", "vodka", "whiskey", "liquor", "rum", "tequila"],
        answer: "No. Even a small amount of alcohol can cause dangerous drops in blood sugar, blood pressure, and body temperature in cats. Never give a cat alcohol.",
    },
    {
        terms: ["xylitol", "birch sugar"],
        answer: "No. Xylitol is a sweetener found in sugar-free gum, candy, and some peanut butters. It can be dangerous to pets, so keep anything containing it away from cats.",
    },
    {
        terms: ["dough"],
        answer: "No. Raw yeast dough can expand in a cat's stomach and produce alcohol as it ferments, causing bloating and alcohol poisoning.",
    },
    {
        terms: ["tylenol", "acetaminophen", "paracetamol", "ibuprofen", "advil", "motrin", "aspirin", "naproxen", "aleve"],
        answer: "No. Common human pain relievers are very dangerous for cats, and even a single acetaminophen (Tylenol) tablet can be fatal. Never give a cat human medication unless a vet tells you to.",
    },
    {
        terms: ["antifreeze", "ethylene glycol"],
        answer: "No. Antifreeze is extremely poisonous to cats, and a few licks can cause fatal kidney failure. If you think your cat has had any, go to a vet immediately.",
    },
];

const TOXIC_PATTERNS = KNOWN_TOXIC.map(({ terms, answer }) => ({
    pattern: new RegExp(`\\b(${terms.join("|")})(s|es)?\\b`, "i"),
    answer,
}));

function knownToxicAnswer(food) {
    return TOXIC_PATTERNS.find(({ pattern }) => pattern.test(food))?.answer;
}

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

    const toxic = knownToxicAnswer(food);
    if (toxic) {
        return res.status(200).json({ answer: toxic, fixed: true });
    }

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
