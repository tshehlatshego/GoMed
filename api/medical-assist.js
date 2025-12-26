import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const OTC_ALLOW_LIST = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Oral Rehydration Salts",
  "ORS",
  "Antacid",
  "Bismuth",
  "Pepto",
  "Famotidine",
  "Pepcid",
  "H2 blocker",
  "Loperamide",
  "Cetirizine",
  "Loratadine",
  "Saline nasal spray",
  "Cough syrup",
  "Zinc",
  "Vitamin C"
];

function filterOTCMedications(medications = []) {
  return medications.filter(med =>
    OTC_ALLOW_LIST.some(allowed =>
      med.name.toLowerCase().includes(allowed.toLowerCase())
    )
  );
}

function determineEscalation(severity) {
  if (severity === "extreme") return "urgent care";
  if (severity === "severe") return "consult doctor";
  return "none";
}

function buildPrompt(symptom, description, severity) {
  const limitedDescription = description ? description.slice(0, 300) : "";

  return `
IMPORTANT:
- Return ONLY raw JSON.
- Do not include markdown, code blocks, or explanations.

You are a medical assistant AI. The user reports:
- Symptom: ${symptom}
- Description: ${limitedDescription}
- Severity: ${severity}

Instructions:
- Only suggest over-the-counter (OTC) medication.
- Follow WHO/NHS guidelines for self-medication.
- Give general guidance, do not diagnose.
- Escalate only if severity is severe or extreme.

Respond EXACTLY in this JSON format:

{
  "guidance": "general medical advice",
  "medications": [
    { "name": "OTC medication name", "description": "short description" }
  ],
  "escalation": "none | consult doctor | urgent care"
}
`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symptom, description = "", severity = "" } = req.body;

  try {
    const prompt = buildPrompt(symptom, description, severity);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleanText = rawText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    const aiResponse = JSON.parse(cleanText);

    return res.json({
      guidance: aiResponse.guidance,
      medications: filterOTCMedications(aiResponse.medications),
      escalation: determineEscalation(severity)
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.json({
      guidance:
        "I’m having trouble analyzing detailed symptoms right now. Based on what you've shared, consider rest, hydration, and basic OTC relief. If symptoms persist or worsen, consult a healthcare professional.",
      medications: [
        { name: "Paracetamol", description: "Helps relieve mild pain or discomfort." },
        { name: "Oral Rehydration Salts", description: "Supports hydration and recovery." }
      ],
      escalation: determineEscalation(severity)
    });
  }
}
