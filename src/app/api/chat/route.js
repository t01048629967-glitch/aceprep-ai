import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "Server misconfiguration: missing API key" }, { status: 500 });
    }

    // 이제 wrongSolution을 추가로 받을 수 있게 합니다.
    const { question, action, wrongSolution } = await request.json();

    let systemPrompt = "You are an expert SAT, ACT, and AP tutor.";
    let finalQuestion = question;

    if (action === "hint") {
      systemPrompt += " ONLY provide a crucial hint. DO NOT solve the problem.";
      finalQuestion = `Give a hint for this problem, but DO NOT solve it:\n\n${question}`;
    } else if (action === "similar") {
      systemPrompt += " Generate ONE new practice problem similar to this one.";
      finalQuestion = `Create a similar practice problem (different numbers/context) for:\n\n${question}`;
    } else if (action === "concept") {
      systemPrompt += " Explain the core concepts. DO NOT solve the specific problem.";
      finalQuestion = `Explain the theory/concepts needed for:\n\n${question}`;
    } else if (action === "analyze") {
      // 오답 분석 모드
      systemPrompt += " Analyze the student's incorrect solution. Identify the error, explain why it happened, and provide the correct steps. Recommend how to avoid this mistake.";
      finalQuestion = `My problem is: ${question}\n\nMy incorrect solution is: ${wrongSolution}\n\nPlease analyze where I went wrong and teach me the correct logic.`;
    } else {
      systemPrompt += " Explain this problem step by step and provide the final answer.";
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: finalQuestion }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return Response.json({ answer: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error) {
    return Response.json({ error: "API Error" }, { status: 500 });
  }
}