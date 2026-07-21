import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJson(text) {
  // AI가 코드펜스(```json ... ```)를 붙이는 경우 제거
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "Server misconfiguration: missing API key" }, { status: 500 });
    }

    const { weakTopicQuestions = [], selectedCourseTitles = [], questionCount = 20 } = await request.json();

    if (weakTopicQuestions.length === 0 && selectedCourseTitles.length === 0) {
      return Response.json(
        { error: "Select at least one subject, or save some notes first, to generate a test." },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert test-writer creating a personalized practice test for a high school student. " +
      "Respond ONLY with a valid JSON array, no markdown code fences, no extra commentary, no explanation text before or after. " +
      'Each item must have exactly this shape: {"id": number, "topic": string, "question": string}. ' +
      "Questions should be exam-style (free response, not multiple choice) and appropriately rigorous for AP/high school level.";

    let userPrompt = `Generate exactly ${questionCount} practice questions.\n\n`;

    if (weakTopicQuestions.length > 0) {
      userPrompt += `The student has previously struggled with problems like these — write NEW questions that reinforce the same underlying concepts (do not repeat these verbatim):\n`;
      userPrompt += weakTopicQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");
      userPrompt += "\n\n";
    }

    if (selectedCourseTitles.length > 0) {
      userPrompt += `Also include questions covering these subjects: ${selectedCourseTitles.join(", ")}.\n\n`;
    }

    userPrompt += `Distribute the ${questionCount} questions reasonably across all the above sources. Return ONLY the JSON array.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 6000,
    });

    const rawText = chatCompletion.choices[0]?.message?.content || "";

    let questions;
    try {
      questions = extractJson(rawText);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", rawText);
      return Response.json({ error: "AI returned an unexpected format. Please try again." }, { status: 500 });
    }

    return Response.json({ questions });
  } catch (error) {
    console.error("Practice test generate error:", error.message);
    return Response.json({ error: error.message || "API Error" }, { status: 500 });
  }
}