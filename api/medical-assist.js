import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { symptom, description, severity } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
IMPORTANT:
 Return ONLY valid JSON.
- No markdown, explanations, or code blocks.
You are a medical assistant AI. The user reports:
- Symptom: ${symptom}
- Description: ${limitedDescription}
- Severity: ${severity}

Instructions:
- Only suggest over-the-counter (OTC) medication.
- Follow WHO/NHS guidelines for self-medication.
- Give general guidance, do not diagnose.
- Escalate only if severity is severe or extreme.
- Respond in JSON format exactly like this:

{
  "guidance": "general medical advice",
   "escalation": "none | consult doctor | urgent care",
  "medications": [{"name": "OTC medication name", "description": "short description"}],
 
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({
      guidance: text,
      medications: [
        { name: "Paracetamol", description: "Pain relief (OTC)" }
      ],
      escalation:
        severity === "severe" || severity === "extreme"
          ? "consult doctor"
          : "none"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      guidance:
        "Sorry, we’re having trouble analyzing your symptoms right now.",
      medications: [],
      escalation: "none"
    });
  }
}

