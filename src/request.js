// Calls our own serverless function (/api/ask) instead of OpenAI directly,
// so the API key stays on the server and is never exposed in the browser.
export default async function request(word) {
    const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
    });

    if (!response.ok) {
        return "Oof. Sorry! Please try a different food.";
    }

    const data = await response.json();
    return data.answer;
}
