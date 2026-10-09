// Calls our own serverless function (/api/ask) instead of Gemini directly,
// so the API key stays on the server and is never exposed in the browser.
const TIMEOUT_MS = 15000;

// Throws if the request fails, times out, or returns no answer, so the
// caller can show an error instead of loading forever.
export default async function request(word) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.answer) {
            throw new Error("Response had no answer");
        }
        return data.answer;
    } finally {
        clearTimeout(timer);
    }
}
