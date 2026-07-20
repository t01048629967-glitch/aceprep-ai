"use client";
import { useState } from "react";
import { getCourseList, getCourse, findTopic } from "@/data/curriculum";

export default function ConceptsExplorer() {
  const [selectedCourse, setSelectedCourse] = useState(null); // courseId
  const [selectedTopic, setSelectedTopic] = useState(null); // topicSlug
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fromCache, setFromCache] = useState(false);

  // Follow-up Q&A state
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState("");

  const courses = getCourseList();
  const course = selectedCourse ? getCourse(selectedCourse) : null;
  const currentTopic = selectedTopic ? findTopic(selectedCourse, selectedTopic) : null;

  const handleSelectTopic = async (topicSlug) => {
    setSelectedTopic(topicSlug);
    setContent("");
    setErrorMsg("");
    setFollowUpAnswer("");
    setFollowUpQuestion("");
    setFollowUpError("");
    setLoading(true);

    const topic = findTopic(selectedCourse, topicSlug);

    try {
      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          courseTitle: course.title,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          unit: topic.unit,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to load this concept.");
      } else {
        setContent(data.content);
        setFromCache(data.cached);
      }
    } catch (e) {
      setErrorMsg("Network error: " + e.message);
    }
    setLoading(false);
  };

  const handleAskFollowUp = async () => {
    if (!followUpQuestion.trim()) return;
    setFollowUpLoading(true);
    setFollowUpError("");
    setFollowUpAnswer("");

    const contextedQuestion =
      `We are studying "${currentTopic.title}" in ${course.title}.\n\n` +
      `Reference material for this topic:\n${content}\n\n` +
      `Student's follow-up question: ${followUpQuestion}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: contextedQuestion, action: "concept" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFollowUpError(data.error || "Failed to get an answer.");
      } else {
        setFollowUpAnswer(data.answer || "No answer returned.");
      }
    } catch (e) {
      setFollowUpError("Network error: " + e.message);
    }
    setFollowUpLoading(false);
  };

  // Screen 1: Subject cards
  if (!selectedCourse) {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-extrabold text-white mb-2">📖 Concepts</h2>
        <p className="text-gray-400 mb-10">Pick a subject to browse lessons and concept reviews.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500 p-8 rounded-3xl text-left transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1"
            >
              <p className="text-white font-bold text-xl mb-2">{c.title}</p>
              <p className="text-gray-500 text-sm">Tap to view lessons →</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 2: Lesson list + concept detail
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <button
        onClick={() => {
          setSelectedCourse(null);
          setSelectedTopic(null);
          setContent("");
        }}
        className="text-blue-400 text-sm mb-4 hover:underline"
      >
        ← All Subjects
      </button>

      <h2 className="text-3xl font-extrabold text-white mb-8">{course.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: lesson list */}
        <div className="md:col-span-1 space-y-6">
          {course.units.map((unit) => (
            <div key={unit.unit}>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">{unit.unit}</p>
              <div className="space-y-1">
                {unit.topics.map((topic) => (
                  <button
                    key={topic.slug}
                    onClick={() => handleSelectTopic(topic.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      selectedTopic === topic.slug
                        ? "bg-blue-600 text-white"
                        : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: concept detail + follow-up Q&A */}
        <div className="md:col-span-2 space-y-6">
          {!selectedTopic && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16 text-center text-gray-500">
              Select a lesson on the left to view its concept summary.
            </div>
          )}

          {loading && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Preparing this concept...</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {content && !loading && (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                {fromCache && <p className="text-xs text-gray-500 mb-4">📦 Loaded from saved reference</p>}
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-200 leading-relaxed">
                  {content}
                </div>
              </div>

              {/* Follow-up AI Q&A box */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h3 className="text-white font-bold mb-3">💬 Ask a question about this topic</h3>
                <textarea
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  placeholder="e.g. Why does the chain rule work this way?"
                  rows={3}
                  className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-blue-500 outline-none resize-none mb-3"
                />
                <button
                  onClick={handleAskFollowUp}
                  disabled={followUpLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                >
                  {followUpLoading ? "Thinking..." : "Ask"}
                </button>

                {followUpError && (
                  <div className="mt-4 bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-xl text-sm">
                    ⚠️ {followUpError}
                  </div>
                )}

                {followUpAnswer && (
                  <div className="mt-4 bg-gray-800 p-5 rounded-2xl border border-gray-700 whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {followUpAnswer}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}