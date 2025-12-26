import { GoogleGenerativeAI } from "@google/generative-ai";

// Serverless API handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symptom, description = "", severity = "" } = req.body;

  console.log("📩 Incoming request:", req.body);

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build strict JSON prompt
    const prompt = `
IMPORTANT:
Return ONLY valid JSON.
No markdown, explanations, or code blocks.
You are a medical assistant AI. The user reports:
- Symptom: ${symptom}
- Description: ${description.slice(0, 300)}
- Severity: ${severity}

Instructions:
- Suggest ONLY over-the-counter (OTC) medications.
- Follow WHO/NHS guidelines.
- Respond in JSON format exactly like this:

{
  "guidance": "general medical advice",
  "escalation": "none | consult doctor | urgent care",
  "medications": [{"name": "OTC medication name", "description": "short description"}]
}
`;

    // Call the AI
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("🤖 RAW Gemini response:\n", rawText);

    // Clean AI output
    const cleanText = rawText.replace(/```/g, "").trim();

    // Parse JSON safely
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanText);
    } catch (err) {
      console.error("❌ Failed to parse AI JSON:", err);
      aiResponse = {
        guidance:
          "I’m having trouble analyzing detailed symptoms right now. Consider rest, hydration, and basic OTC relief.",
        medications: [
          { name: "Paracetamol", description: "Helps relieve mild pain or discomfort." },
          { name: "Oral Rehydration Salts", description: "Supports hydration and recovery." }
        ],
        escalation:
          severity === "extreme"
            ? "urgent care"
            : severity === "severe"
            ? "consult doctor"
            : "none"
      };
    }

    // Send response
    res.status(200).json({
      guidance: aiResponse.guidance || "Consider rest, hydration, and OTC support.",
      medications: aiResponse.medications || [],
      escalation: aiResponse.escalation || "none"
    });

  } catch (error) {
    console.error("❌ Gemini fetch error:", error.message);
    res.status(500).json({
      guidance:
        "Sorry, we’re having trouble analyzing your symptoms right now.",
      medications: [
        { name: "Paracetamol", description: "Helps relieve mild pain or discomfort." },
        { name: "Oral Rehydration Salts", description: "Supports hydration and recovery." }
      ],
      escalation: severity === "extreme" ? "urgent care" : "none"
    });
  }
}
