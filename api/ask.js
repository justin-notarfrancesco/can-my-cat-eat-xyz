import OpenAI from "openai";

// Runs on Vercel's servers. The API key is read from a server-side env var
// (OPENAI_API_KEY) and is never sent to the browser.
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { word } = req.body || {};
    if (!word || typeof word !== "string") {
        return res.status(400).json({ error: "Missing 'word' in request body" });
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Responses API (the modern interface). gpt-5.4-mini is a reasoning
        // model, so it uses `reasoning.effort` instead of `temperature`, and
        // `max_output_tokens` instead of `max_tokens`. Output text is read via
        // the `output_text` helper.
        const response = await openai.responses.create({
            model: "gpt-5.4-mini",
            input: `In general, can cats eat ${word}? Start your response with either "Yes." or "No.". Then, in 2-3 complete sentences, give a reason for why cats can or cannot eat ${word}. If you don't have an answer or the question doesn't make sense, then just return "Oof. Sorry! Please try a different food.".`,
            reasoning: { effort: "minimal" },
            text: { verbosity: "low" },
            max_output_tokens: 400,
        });

        return res.status(200).json({ answer: response.output_text });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to get a response" });
    }
}
