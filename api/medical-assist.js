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
- No markdown or explanations.

User:
Symptom: ${symptom}
Description: ${limitedDescription}
Severity: ${severity}

Respond exactly as:

{
  "guidance": "general advice",
  "medications": [{"name": "OTC name", "description": "short description"}],
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
    const rawText = await result.response.text();

    const cleanText = rawText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

  
let aiResponse;
try {
  aiResponse = JSON.parse(cleanText);
} catch (err) {
  console.warn("Failed to parse AI JSON, using fallback:", err);
  aiResponse = {
    guidance: "",
    medications: [],
    escalation: "none"
  };
}

    return res.json({
      guidance: aiResponse.guidance,
      medications: filterOTCMedications(aiResponse.medications),
      escalation: determineEscalation(severity)
    });

  } catch (err) {
    console.error("AI error:", err);

    return res.json({
      guidance:
        "Based on what you've shared, rest, hydration, and Over-the-counter medication may help. If symptoms worsen, consult a healthcare professional.",
      medications: [
        { name: "Paracetamol", description: "Pain or fever relief." },
        { name: "Oral Rehydration Salts", description: "Hydration support." }
      ],
      escalation: determineEscalation(severity)
    });
  }
}

