import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { tool, business, request } = req.body || {};

    if (!business || !tool) {
      return res.status(400).json({
        error: "Missing business profile or tool.",
      });
    }

    const prompt = `
You are TABLEAI, an AI marketing and growth assistant for businesses and startups.

Create practical, natural, ready-to-use marketing output.

RULES:
- Never invent prices, discounts, products, services, reviews, awards, statistics or business claims.
- Use only information supplied by the business.
- If information is missing, clearly label suggestions as suggestions.
- Keep writing natural and human.
- Avoid generic AI-sounding language.
- Avoid excessive emojis.
- Make the result useful for a busy business owner.
- Give specific and actionable output.

BUSINESS PROFILE:
${JSON.stringify(business, null, 2)}

TABLEAI TOOL:
${tool}

USER REQUEST:
${request || "Create the most useful output for this request."}
`;

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    return res.status(200).json({
      output: response.output_text,
    });

  } catch (error) {
    console.error("TABLEAI error:", error);

    return res.status(500).json({
      error: "TABLEAI could not generate the result.",
    });
  }
}
