import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "Server misconfiguration: missing API key" }, { status: 500 });
    }

    const { answers = [] } = await request.json();

    if (answers.length === 0) {
      return Response.json({ error: "No answers submitted." }, { status: 400 });
    }

    const systemPrompt =
      "You are grading a student's practice test. For each question, determine if the student's answer is " +
      "essentially correct (minor wording differences are fine, focus on whether the reasoning/final answer is right). " +
      "Give a SHORT (2-3 sentences max), encouraging but honest explanation of the correct approach for each one — " +
      "brevity matters since this test may have many questions. " +
      "Respond ONLY with valid JSON, no markdown code fences, no extra text. " +
      'Shape: {"results": [{"id": number, "correct": boolean, "explanation": string}], "score": number, "total": number}. ' +
      "score = number of correct answers, total = total number of questions.";

    const userPrompt = `Grade this practice test:\n\n${JSON.stringify(answers, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 8000,
    });

    const rawText = chatCompletion.choices[0]?.message?.content || "";

    let result;
    try {
      result = extractJson(rawText);
    } catch (parseError) {
      console.error("Failed to parse grading JSON:", rawText);
      return Response.json({ error: "AI returned an unexpected format while grading. Please try again." }, { status: 500 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("Practice test grade error:", error.message);
    return Response.json({ error: error.message || "API Error" }, { status: 500 });
  }
}