require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {GoogleGenerativeAI} = require("@google/generative-ai"); // Or use OpenAI SDK

const app = express();
const PORT = process.env.PORT || 5000;
const apiKey=process.env.GEMINI_API_KEY;
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({ status: "GoMed backend running" });
});

let lastRequestTime = 0;

function rateLimit(req, res, next) {
  const now = Date.now();
  if (now - lastRequestTime < 1500) {
    return res.status(429).json({
      guidance: "Please wait a moment before submitting again.",
      medications: [],
      escalation: "none"
    });
  }
  lastRequestTime = now;
  next();
}


console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
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
    OTC_ALLOW_LIST.some(
      allowed =>
        med.name.toLowerCase().includes(allowed.toLowerCase())
    )
  );
}

 // replace bodyParser

function determineEscalation(severity) {
  if (severity === "extreme") return "urgent care";
  if (severity === "severe") return "consult doctor";
  return "none";
}

// -----------------------------
// Helper: safe AI prompt
// -----------------------------
function buildPrompt(symptom, description, severity) {
  const limitedDescription = description
  ? description.slice(0, 300)
  : "";
  return `
 IMPORTANT:
-Return ONLY raw JSON.
-Do not include markdown, code blocks, or explanations.
You are a medical assistant AI. The user reports:
- Symptom: ${symptom}
- Description: ${limitedDescription}
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
// API Endpoint
// -----------------------------
app.post("/api/medical-assist", rateLimit, async (req, res) => {
  const { symptom, description = "", severity = "" } = req.body;

  console.log("📩 Incoming request:", req.body);

  try {
    const prompt = buildPrompt(symptom, description, severity);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("🤖 RAW Gemini response:\n", rawText);

    const cleanText = rawText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧹 CLEANED text:\n", cleanText);

    const aiResponse = JSON.parse(cleanText);

    console.log("✅ PARSED JSON:", aiResponse);

    res.json({
      guidance: aiResponse.guidance,
      medications: filterOTCMedications(aiResponse.medications),
      escalation: determineEscalation(severity)
    });

  }catch (error) {
  console.error("❌ Gemini fetch error:", error.message);

  return res.json({
    guidance:
      "I’m having trouble analyzing detailed symptoms right now. Based on what you've shared, consider rest, hydration, and basic OTC relief. If symptoms persist or worsen, consult a healthcare professional.",
    medications: [
      {
        name: "Paracetamol",
        description: "Helps relieve mild pain or discomfort."
      },
      {
        name: "Oral Rehydration Salts",
        description: "Supports hydration and recovery."
      }
    ],
    escalation: determineEscalation(severity)
  });
}
});



