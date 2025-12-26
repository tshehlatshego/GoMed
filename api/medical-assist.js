import { GoogleGenerativeAI } from "@google/generative-ai";

let lastRequestTime = 0;

// -----------------------------
// Rate limit (per function instance)
// -----------------------------
function rateLimit() {
  const now = Date.now();
  if (now - lastRequestTime < 1500) {
    return false;
  }
  lastRequestTime = now;
  return true;
}

// -----------------------------
// Config
// -----------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const OTC_ALLOW_LIST = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Dextromethorphan",
  "Guaifenesin",
  "Cough",
  "Lozenge",
  "Honey",
  "Saline nasal spray",
  "Cetirizine",
  "Loratadine",
  "Oral Rehydration Salts",
  "ORS",
  "Antacid",
  "Bismuth",
  "Pepto",
  "Famotidine",
  "Pepcid",
  "H2 blocker",
  "Loperamide",
  "Zinc",
  "Vitamin C"
];

// -----------------------------
// Helpers
// -----------------------------
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
  return `
IMPORTANT:
-Return ONLY raw JSON.
-Do not include markdown, code blocks, or explanations.
You are a medical assistant AI. The user reports:
- Symptom: ${symptom}
- Description: ${description.slice(0, 300)}
- Severity: ${severity}

Instructions:
- Only suggest over-the-counter (OTC) medication.
- Follow WHO/NHS guidelines for self-medication.
- Give general guidance, do not diagnose.
- Escalate only if severity is severe or extreme.
- Respond in JSON format:

{
  "guidance": "general medical advice",
   "escalation": "none | consult doctor | urgent care"
  "medications": [{"name": "OTC medication name", "description": "short description"}],
 
}
`;
}

// -----------------------------
// Serverless handler
// -----------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!rateLimit()) {
    return res.status(429).json({
      guidance: "Please wait a moment before submitting again.",
      medications: [],
      escalation: "none"
    });
  }

  const { symptom, description = "", severity = "" } = req.body;

 try {
  console.log("🔑 API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  const prompt = buildPrompt(symptom, description, severity);
  console.log("📨 PROMPT SENT");

  const result = await model.generateContent(prompt);
  console.log("🤖 Gemini responded");

  const rawText = result.response.text();
  console.log("RAW TEXT:", rawText);

  const cleanText = rawText
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  console.log("CLEAN TEXT:", cleanText);

  const aiResponse = JSON.parse(cleanText);
  console.log("PARSED JSON OK");

  let medications = filterOTCMedications(aiResponse.medications);

  if (!medications.length) {
    medications = [{
      name: "Cough Syrup",
      description: "Helps relieve cough symptoms."
    }];
  }

  return res.status(200).json({
    guidance: aiResponse.guidance,
    medications,
    escalation: determineEscalation(severity)
  });

} catch (error) {
  console.error("❌ SERVER ERROR:", error);

  return res.status(200).json({
    guidance: "Sorry, we’re having trouble analyzing your symptoms right now.",
    medications: [],
    escalation: "none"
  });
}

}


