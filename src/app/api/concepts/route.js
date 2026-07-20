import Groq from "groq-sdk";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "Server misconfiguration: missing API key" }, { status: 500 });
    }

    const { courseId, courseTitle, topicSlug, topicTitle, unit } = await request.json();

    if (!courseId || !topicSlug || !topicTitle) {
      return Response.json({ error: "courseId, topicSlug, topicTitle are required." }, { status: 400 });
    }

    const docId = `${courseId}__${topicSlug}`;
    const docRef = doc(db, "concepts", docId);

    // 1. Check cache first
    const cached = await getDoc(docRef);
    if (cached.exists()) {
      return Response.json({ content: cached.data().content, cached: true });
    }

    // 2. Not cached — generate with AI, Khan-Academy-style teaching approach
    const systemPrompt =
      "You are an expert AP Math/Physics/Chemistry teacher writing a concept reference page for high school students, " +
      "in the style of Khan Academy: friendly, intuitive, building understanding from first principles, using plain language " +
      "before formal notation, and relatable analogies where helpful. Do not copy or closely paraphrase any specific existing " +
      "source text — write original explanations in this teaching style. " +
      "Use markdown formatting: ## for section headers, **bold** for key terms, numbered/bulleted lists for steps. " +
      "Structure it as: 1) Big Picture Intuition (plain-language, no jargon yet), 2) Formal Definition / Key Formula(s), " +
      "3) Step-by-Step Approach, 4) One Worked Example, 5) Common Mistakes Students Make. " +
      "Keep it exam-relevant at AP level rigor, but never lose the intuitive explanation in step 1.";

    const finalPrompt = `Course: ${courseTitle}\nUnit: ${unit || ""}\nTopic: ${topicTitle}\n\nWrite the concept reference page for this topic.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const content = chatCompletion.choices[0]?.message?.content || "";

    if (!content) {
      return Response.json({ error: "AI returned an empty response." }, { status: 500 });
    }

    // 3. Cache it in Firestore so future requests skip the AI call
    await setDoc(docRef, {
      courseId,
      courseTitle,
      topicSlug,
      topicTitle,
      unit: unit || "",
      content,
      createdAt: serverTimestamp(),
    });

    return Response.json({ content, cached: false });
  } catch (error) {
    console.error("Concepts API error:", error.message);
    return Response.json({ error: error.message || "API Error" }, { status: 500 });
  }
}