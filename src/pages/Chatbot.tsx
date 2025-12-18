import { useState } from "react";
import { AlertTriangle, MessageCircle } from "lucide-react";

type ChatItem = { question: string; answer: string };

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const medicalKnowledge: Record<string, string> = {
    hypertension:
      "Hypertension (high blood pressure) is when blood pressure is consistently above 130/80 mmHg. It increases risk of heart disease and stroke. Lifestyle changes like reducing salt, exercising, and stress management can help.",
    diabetes:
      "Diabetes is a condition where the body doesn't properly process blood sugar. Type 1 is autoimmune, Type 2 is often lifestyle-related. Symptoms include increased thirst, frequent urination, and fatigue.",
    cholesterol:
      "Cholesterol is a waxy substance in your blood. HDL is 'good' cholesterol, LDL is 'bad'. Normal total cholesterol is below 200 mg/dL. Diet and exercise help manage levels.",
    "blood pressure":
      "Normal blood pressure is around 120/80 mmHg. High blood pressure (hypertension) is 130/80 or higher. Low blood pressure (hypotension) is below 90/60.",
    headache:
      "Headaches can be tension-type, migraine, or cluster. Common remedies include rest, hydration, and over-the-counter pain relievers. See a doctor if severe or frequent.",
    fever:
      "Normal body temperature is around 98.6°F (37°C). Fever is typically 100.4°F (38°C) or higher. Rest and fluids are important. Consult a doctor if fever persists.",
    cough:
      "Coughs can be dry or productive. Often caused by colds, allergies, or infections. Hydration and honey can help soothe. See a doctor if lasting more than 3 weeks.",
    asthma:
      "Asthma is a chronic lung condition causing breathing difficulties. Symptoms include wheezing, coughing, and chest tightness. Managed with inhalers and avoiding triggers.",
    allergies:
      "Allergies occur when immune system reacts to substances like pollen, dust, or food. Symptoms include sneezing, itching, and rash. Antihistamines can provide relief.",
    nutrition:
      "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated and limit processed foods, sugar, and salt."
  };

  const emergencyKeywords = [
    "heart attack",
    "stroke",
    "suicide",
    "bleeding",
    "chest pain",
    "difficulty breathing",
    "unconscious",
    "severe pain",
    "choking"
  ];

  const restrictedPhrases = [
    "diagnose me",
    "prescribe",
    "treatment for",
    "what medicine",
    "do i have",
    "is this cancer",
    "cure for",
    "should i take"
  ];

  function checkSafety(query: string): { safe: boolean; message: string } {
    const lower = query.toLowerCase();
    for (const keyword of emergencyKeywords) {
      if (lower.includes(keyword)) {
        return {
          safe: false,
          message:
            "🚨 EMERGENCY: This sounds serious. Please call your local emergency number or go to the nearest emergency room immediately. For '" +
            keyword +
            "', immediate medical attention is required."
        };
      }
    }
    for (const phrase of restrictedPhrases) {
      if (lower.includes(phrase)) {
        return {
          safe: false,
          message:
            "⚠ I cannot provide diagnoses, prescriptions, or specific treatment advice. Please consult a healthcare provider for personal medical guidance."
        };
      }
    }
    return { safe: true, message: "" };
  }

  function getMedicalResponse(query: string): string {
    const lower = query.toLowerCase();
    for (const [term, info] of Object.entries(medicalKnowledge)) {
      if (lower.includes(term)) return info;
    }
    if (/(what|explain|tell me about)/.test(lower)) {
      return "I can share general info on hypertension, diabetes, cholesterol, nutrition, and common symptoms. What specific topic would you like to learn about?";
    }
    if (/(how|prevent)/.test(lower)) {
      return "General prevention tips: balanced diet, regular exercise, good sleep, stress management, routine check-ups, avoid smoking and excessive alcohol.";
    }
    return "I can provide general health information on common conditions and wellness. Try asking about blood pressure, diabetes, nutrition, or symptoms. This is for educational purposes only.";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const safety = checkSafety(question);
    if (!safety.safe) {
      setResponse(safety.message);
      setChatHistory((prev) => [...prev, { question, answer: safety.message }]);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      const answer = getMedicalResponse(question);
      const fullResponse = `${answer}\n\n---\n*This information is for educational purposes only. Always consult a healthcare professional for medical advice.*`;
      setResponse(fullResponse);
      setChatHistory((prev) => [...prev, { question, answer: fullResponse }]);
      setLoading(false);
    }, 700);
  }

  const exampleQuestions = [
    "What is hypertension?",
    "Explain diabetes",
    "Normal blood pressure range?",
    "What is cholesterol?",
    "Headache remedies",
    "Fever treatment",
    "Asthma symptoms",
    "Nutrition tips",
    "Allergy management",
    "How to prevent illness"
  ];

  function clearChat() {
    setChatHistory([]);
    setResponse("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2 text-emerald-200">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Medical Information Assistant</h1>
            <p className="mt-1 text-slate-300">General health info — educational use only</p>
          </div>
        </div>
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
          <div className="flex items-start gap-3 text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Important disclaimer</p>
              <p className="text-sm">This is a demonstration prototype. Not for medical use. In emergencies, call your local emergency number.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Chat */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-emerald-500/10">
            {response && (
              <div className="border-b border-white/10 p-6">
                <div className="mb-3 flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium">Response</span>
                </div>
                <div className="whitespace-pre-wrap text-slate-200">
                  {response}
                </div>
              </div>
            )}

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="question" className="mb-2 block text-sm font-medium text-slate-200">
                    Your health question
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Example: What should I know about high blood pressure?"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 p-4 text-slate-100 placeholder-slate-400 outline-none ring-emerald-400/0 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
                    rows={4}
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/20 px-6 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5" /> Ask Question
                      </>
                    )}
                  </button>
                  {chatHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-6">
                <p className="mb-3 text-sm text-slate-400">Try asking about:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.slice(0, 6).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q)}
                      className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-emerald-400/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: History & Topics */}
        <div className="space-y-6">
          {chatHistory.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-emerald-500/10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-white">Recent Questions</h3>
                <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-200">
                  {chatHistory.length}
                </span>
              </div>
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {chatHistory.slice(-5).reverse().map((item, idx) => (
                  <div key={idx} className="border-l-4 border-emerald-400/40 pl-3">
                    <p className="truncate text-sm font-medium text-slate-200">{item.question}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.answer.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-emerald-500/10">
            <h3 className="mb-4 font-medium text-white">Health Topics Available</h3>
            <div className="space-y-2">
              {Object.keys(medicalKnowledge).map((topic) => (
                <div key={topic} className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="capitalize">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-red-200">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚑</span>
              <div>
                <h4 className="mb-2 font-medium">Emergency notice</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Chest pain or pressure</li>
                  <li>• Difficulty breathing</li>
                  <li>• Severe bleeding</li>
                  <li>• Sudden confusion</li>
                  <li>• Suicidal thoughts</li>
                </ul>
                <p className="mt-3 text-sm font-medium">Call your local emergency number immediately for these symptoms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
          <span className="text-slate-400">ℹ</span>
          <p>
            This assistant provides general health information only and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
 
