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
You are a medical information assistant.
Follow WHO and NHS guidelines.
DO NOT diagnose.
ONLY recommend OTC medication.
Symptom: ${symptom}
Details: ${description}
Severity: ${severity}
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
