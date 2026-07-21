"use client";
import { useState, useEffect } from "react";
import { getCourseList } from "@/data/curriculum";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { subscribeToNotes } from "@/lib/notesService";

export default function PracticeTestGenerator() {
  const [stage, setStage] = useState("setup"); // setup | testing | results
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [useNotes, setUseNotes] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { id: answerText }
  const [currentIndex, setCurrentIndex] = useState(0);

  const [gradingResult, setGradingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const courses = getCourseList();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const unsubscribeNotes = subscribeToNotes(user.uid, (fetchedNotes) => setNotes(fetchedNotes));
    return () => unsubscribeNotes();
  }, [user]);

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((c) => c !== courseId) : [...prev, courseId]
    );
  };

  const handleGenerateTest = async () => {
    setErrorMsg("");
    setLoading(true);

    const weakTopicQuestions = useNotes ? notes.slice(0, 8).map((n) => n.question) : [];
    const selectedCourseTitles = courses
      .filter((c) => selectedCourses.includes(c.id))
      .map((c) => c.title);

    try {
      const res = await fetch("/api/practice-test/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weakTopicQuestions, selectedCourseTitles, questionCount: 20 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to generate test.");
      } else {
        setQuestions(data.questions);
        setAnswers({});
        setCurrentIndex(0);
        setGradingResult(null);
        setStage("testing");
      }
    } catch (e) {
      setErrorMsg("Network error: " + e.message);
    }
    setLoading(false);
  };

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitTest = async () => {
    setErrorMsg("");
    setLoading(true);

    const payload = questions.map((q) => ({
      id: q.id,
      topic: q.topic,
      question: q.question,
      studentAnswer: answers[q.id] || "(no answer given)",
    }));

    try {
      const res = await fetch("/api/practice-test/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to grade test.");
      } else {
        setGradingResult(data);
        setStage("results");
      }
    } catch (e) {
      setErrorMsg("Network error: " + e.message);
    }
    setLoading(false);
  };

  const handleRestart = () => {
    setStage("setup");
    setQuestions([]);
    setAnswers({});
    setGradingResult(null);
    setErrorMsg("");
  };

  // ---------- Stage: Setup ----------
  if (stage === "setup") {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-extrabold text-white mb-2">📝 Practice Test Generator</h2>
        <p className="text-gray-400 mb-8">Build a custom test from your weak areas, other subjects, or both.</p>

<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={useNotes} onChange={(e) => setUseNotes(e.target.checked)} className="w-5 h-5" />
            <span className="text-white font-bold">Include questions based on my saved notes ({notes.length} saved)</span>
          </label>
          {!user && (
            <p className="text-gray-500 text-sm mt-2 ml-8">Log in with Google on the main dashboard to use your saved notes here.</p>
          )}
          {user && notes.length === 0 && (
            <p className="text-gray-500 text-sm mt-2 ml-8">No saved notes yet — save some from the Study tab first.</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <p className="text-white font-bold mb-4">Also include questions from these subjects:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {courses.map((c) => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(c.id)}
                  onChange={() => toggleCourse(c.id)}
                  className="w-4 h-4"
                />
                <span className="text-gray-200 text-sm">{c.title}</span>
              </label>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl mb-6">⚠️ {errorMsg}</div>
        )}

        <button
          onClick={handleGenerateTest}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20"
        >
          {loading ? "Generating your test..." : "Generate Test"}
        </button>
      </div>
    );
  }

  // ---------- Stage: Testing ----------
  if (stage === "testing") {
    const q = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Question {currentIndex + 1} of {questions.length}</h2>
          <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">{q.topic}</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-6">
          <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">{q.question}</p>
        </div>

        <textarea
          value={answers[q.id] || ""}
          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          placeholder="Type your answer here..."
          rows={5}
          className="w-full bg-gray-900 text-white p-5 rounded-2xl border border-gray-700 focus:border-blue-500 outline-none resize-none mb-6"
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            ← Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmitTest}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              {loading ? "Grading..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Next →
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mt-6 bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl">⚠️ {errorMsg}</div>
        )}
      </div>
    );
  }

  // ---------- Stage: Results ----------
  if (stage === "results" && gradingResult) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-extrabold text-white mb-2">Test Results</h2>
        <div className="bg-gray-900 border border-purple-800/50 rounded-3xl p-8 mb-8 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Your Score</p>
          <p className="text-6xl font-extrabold text-purple-400">
            {gradingResult.score}/{gradingResult.total}
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const result = gradingResult.results.find((r) => r.id === q.id);
            return (
              <div
                key={q.id}
                className={`bg-gray-900 border rounded-2xl p-6 ${
                  result?.correct ? "border-green-800/50" : "border-red-800/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">{q.topic}</span>
                  <span className={`font-bold text-sm ${result?.correct ? "text-green-400" : "text-red-400"}`}>
                    {result?.correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <p className="text-gray-200 font-medium mb-3">{q.question}</p>
                <p className="text-gray-400 text-sm mb-2">
                  <span className="font-bold">Your answer:</span> {answers[q.id] || "(no answer)"}
                </p>
                <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap">
                  {result?.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors"
        >
          Generate Another Test
        </button>
      </div>
    );
  }

  return null;
}