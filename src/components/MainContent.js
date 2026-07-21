"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { calculateNextReview, defaultSrsState, getDueNotes } from "@/lib/srs";
import { subscribeToNotes, addNote, deleteNote, updateNoteSrs } from "@/lib/notesService";

export default function MainContent() {
  const [view, setView] = useState("dashboard");

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [question, setQuestion] = useState("");
  const [wrongSolution, setWrongSolution] = useState("");
  const [response, setResponse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Daily Review용 상태
  const [reviewProblem, setReviewProblem] = useState(null);
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [userReviewAnswer, setUserReviewAnswer] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [rated, setRated] = useState(false);

  // 로그인 상태 감지
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // 로그인된 사용자의 노트를 Firestore에서 실시간 구독
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    setNotesLoading(true);
    const unsubscribeNotes = subscribeToNotes(
      user.uid,
      (fetchedNotes) => {
        setNotes(fetchedNotes);
        setNotesLoading(false);
      },
      () => setNotesLoading(false)
    );

    return () => unsubscribeNotes();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  const handleAskAI = async (action) => {
    if (!question.trim()) return alert("Please enter a problem!");
    setLoading(true);
    setResponse("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, wrongSolution, action }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setErrorMsg(data.error || "AI로부터 응답을 받지 못했습니다.");
      } else {
        setResponse(data.answer || "응답이 비어있습니다.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setErrorMsg("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  const handleSaveNote = async () => {
    if (!question || !response) return alert("Both a problem and an AI response are required to save.");
    if (!user) return alert("Please log in with Google to save notes.");

    try {
      await addNote(user.uid, {
        question,
        wrongSolution,
        response,
        date: new Date().toLocaleString(),
        srs: defaultSrsState(),
      });
      setView("notes");
    } catch (e) {
      console.error("Save note error:", e);
      alert("Failed to save note: " + e.message);
    }
  };

  const handleDeleteNote = async (e, id) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteNote(user.uid, id);
    } catch (e) {
      console.error("Delete note error:", e);
      alert("Failed to delete note: " + e.message);
    }
  };

  const handleLoadNote = (note) => {
    setQuestion(note.question);
    setWrongSolution(note.wrongSolution || "");
    setResponse(note.response);
    setErrorMsg("");
    setView("home");
  };

  const handleGenerateReview = async () => {
    if (!user) return alert("Please log in with Google to use spaced review.");
    if (notes.length === 0) {
      alert("You need at least one saved note to generate a review question!");
      return;
    }

    const dueNotes = getDueNotes(notes);
    if (dueNotes.length === 0) {
      alert("Nothing is due for review right now — check back later! (Spaced repetition schedules reviews over time.)");
      return;
    }

    setView("review");
    setIsReviewLoading(true);
    setReviewQuestion("");
    setUserReviewAnswer("");
    setReviewFeedback("");
    setRated(false);

    const targetNote = dueNotes[0];
    setReviewProblem(targetNote);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Create a similar but slightly different practice problem to test my understanding of this topic. Provide ONLY the new problem text. DO NOT provide the solution yet.\n\nOriginal problem concept: ${targetNote.question}`,
          wrongSolution: "",
          action: "solve",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setReviewQuestion("문제 생성 실패: " + (data.error || "알 수 없는 오류"));
      } else {
        setReviewQuestion(data.answer || "생성된 문제가 비어있습니다.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setReviewQuestion("Failed to generate a review question. Please try again.");
    }
    setIsReviewLoading(false);
  };

  const handleSubmitReviewAnswer = async () => {
    if (!userReviewAnswer.trim()) return alert("Please enter your answer first!");

    setIsReviewLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Practice Problem: ${reviewQuestion}\n\nMy Answer: ${userReviewAnswer}\n\nPlease evaluate my answer, let me know if it is correct or incorrect, and provide the correct step-by-step solution.`,
          wrongSolution: "",
          action: "analyze",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setReviewFeedback("평가 실패: " + (data.error || "알 수 없는 오류"));
      } else {
        setReviewFeedback(data.answer || "평가 결과가 비어있습니다.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setReviewFeedback("Failed to evaluate your answer. Please try again.");
    }
    setIsReviewLoading(false);
  };

  const handleRateReview = async (quality) => {
    if (!reviewProblem || !user) return;

    const prevSrs = reviewProblem.srs || defaultSrsState();
    const updatedSrs = calculateNextReview(quality, prevSrs.repetitions, prevSrs.easeFactor, prevSrs.interval);

    try {
      await updateNoteSrs(user.uid, reviewProblem.id, updatedSrs);
      setRated(true);
      // 화면에 즉시 반영 (실시간 구독이 곧 다시 반영하겠지만, 지연 없이 바로 보여주기 위함)
      setReviewProblem({ ...reviewProblem, srs: updatedSrs });
    } catch (e) {
      console.error("Update SRS error:", e);
      alert("Failed to update review schedule: " + e.message);
    }
  };

  const dueCount = getDueNotes(notes).length;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 네비게이션 헤더 */}
        <nav className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-800 gap-4">
          <div className="cursor-pointer" onClick={() => setView("dashboard")}>
            <h1 className="text-3xl font-extrabold text-white tracking-tight hover:text-blue-400 transition-colors">AcePrep AI</h1>
            <p className="text-gray-400 text-sm mt-1">Your smart study notes</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setView("dashboard")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === "dashboard" ? "bg-green-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}>📊 Dashboard</button>
            <button onClick={() => setView("home")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === "home" ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}>✏️ Study</button>
            <button onClick={() => setView("notes")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === "notes" ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}>📚 My Notes</button>
            <button onClick={handleGenerateReview} className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === "review" ? "bg-purple-600 text-white" : "bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-800/50"}`}>
              🎯 Daily Review
              {dueCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{dueCount}</span>
              )}
            </button>
            <a href="/concepts" className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">📖 Concepts</a>
            <a href="/practice-test" className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">📝 Practice Test</a>

            {user ? (
              <button onClick={() => signOut(auth)} className="bg-red-900/50 hover:bg-red-800 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-800/50 ml-2">Logout</button>
            ) : (
              <button onClick={handleLogin} className="bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors ml-2">Google Login</button>
            )}
          </div>
        </nav>

        {/* 로그인 안 된 상태 안내 배너 (전역) */}
        {authChecked && !user && (
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
            <p className="text-blue-300 text-sm">🔒 Log in with Google to save notes and sync them across your devices.</p>
            <button onClick={handleLogin} className="bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Google Login</button>
          </div>
        )}

        {/* 0. 대시보드 화면 */}
        {view === "dashboard" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>📊</span> Welcome back{user ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-green-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Notes</p>
                <p className="text-5xl font-extrabold text-white">{notes.length}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-purple-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Due for Review</p>
                <p className="text-5xl font-extrabold text-purple-400">{dueCount}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-orange-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Study Streak</p>
                <p className="text-4xl font-extrabold text-orange-400 flex items-center gap-2">🔥 1 <span className="text-xl">Day</span></p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-200">Recent Activity</h3>
                <button onClick={() => setView("notes")} className="text-blue-500 text-sm font-bold hover:underline">View All →</button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No activity yet.</p>
                  <button onClick={() => setView("home")} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Start Studying</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.slice(0, 3).map((note, idx) => (
                    <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                      <p className="text-gray-300 font-medium truncate pr-4">{note.question}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{note.date?.split(",")[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. 홈 화면 */}
        {view === "home" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-2 ml-1">Problem</label>
                <textarea className="w-full h-40 bg-gray-900 text-white p-5 rounded-2xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner" placeholder="Enter your problem here..." value={question} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-2 ml-1">My Solution (Optional)</label>
                <textarea className="w-full h-32 bg-gray-900 text-white p-5 rounded-2xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all shadow-inner" placeholder="Enter your approach or incorrect solution for AI analysis." value={wrongSolution} onChange={(e) => setWrongSolution(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={() => handleAskAI("solve")} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20">{loading ? "AI is thinking..." : "Solve"}</button>
              <button onClick={() => handleAskAI("analyze")} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-purple-900/20">{loading ? "Analyzing..." : "Analyze"}</button>
            </div>

            {errorMsg && (
              <div className="mt-6 bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {response && (
              <div className="mt-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white ml-2">AI's Response</h3>
                  <button onClick={handleSaveNote} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-900/20">
                    {user ? "Save to Notes" : "Log in to Save"}
                  </button>
                </div>
                <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 leading-relaxed whitespace-pre-wrap text-gray-200 shadow-2xl">{response}</div>
              </div>
            )}
          </div>
        )}

        {/* 2. 오답노트 보관함 화면 */}
        {view === "notes" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3"><span>📚</span> Saved Notes Collection</h2>

            {!user ? (
              <div className="bg-gray-900 rounded-3xl border border-gray-800 p-16 text-center">
                <p className="text-gray-400 text-lg mb-4">Log in to view your saved notes.</p>
                <button onClick={handleLogin} className="bg-white hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold">Google Login</button>
              </div>
            ) : notesLoading ? (
              <div className="bg-gray-900 rounded-3xl border border-gray-800 p-16 text-center text-gray-500">Loading your notes...</div>
            ) : notes.length === 0 ? (
              <div className="bg-gray-900 rounded-3xl border border-gray-800 p-16 text-center">
                <p className="text-gray-400 text-lg">No saved notes yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note, index) => (
                  <div key={note.id || index} onClick={() => handleLoadNote(note)} className="group bg-gray-900 hover:bg-gray-800 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 cursor-pointer transition-all relative shadow-lg">
                    <p className="text-md font-bold text-gray-100 mb-3 line-clamp-3 pr-8 leading-snug">{note.question}</p>
                    <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-4">
                      <p className="text-xs text-gray-500 font-medium">{note.date}</p>
                      {note.srs && (
                        <p className="text-xs text-purple-400 font-medium">
                          Next review: {new Date(note.srs.nextReview).toLocaleDateString()}
                        </p>
                      )}
                      <span className="text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Read more →</span>
                    </div>
                    <button onClick={(e) => handleDeleteNote(e, note.id)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Daily Review 화면 */}
        {view === "review" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3"><span>🎯</span> Daily Challenge</h2>

            <div className="bg-gray-900 rounded-3xl border border-purple-900/50 p-8 shadow-2xl">
              {isReviewLoading && !reviewQuestion ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-purple-300 font-medium animate-pulse">Generating a custom practice problem...</p>
                </div>
              ) : (
                <>
                  {reviewQuestion && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4">Practice Problem</p>
                      <div className="prose prose-invert max-w-none text-gray-100 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                        {reviewQuestion}
                      </div>
                    </div>
                  )}

                  {!reviewFeedback && reviewQuestion && (
                    <div className="mt-8 space-y-4 animate-in fade-in duration-500">
                      <label className="text-sm font-semibold text-purple-300">Your Answer</label>
                      <textarea
                        className="w-full h-32 bg-gray-800 text-white p-5 rounded-2xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none shadow-inner"
                        placeholder="Solve the problem and type your answer/steps here..."
                        value={userReviewAnswer}
                        onChange={(e) => setUserReviewAnswer(e.target.value)}
                        disabled={isReviewLoading}
                      />
                      <button
                        onClick={handleSubmitReviewAnswer}
                        disabled={isReviewLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-purple-900/20"
                      >
                        {isReviewLoading ? "Grading your answer..." : "Submit Answer"}
                      </button>
                    </div>
                  )}

                  {reviewFeedback && (
                    <div className="mt-8 pt-8 border-t border-gray-800 animate-in slide-in-from-bottom-4 fade-in duration-500">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>📝</span> AI Evaluation</h3>
                      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 leading-relaxed whitespace-pre-wrap text-gray-200">
                        {reviewFeedback}
                      </div>

                      {!rated ? (
                        <div className="mt-8">
                          <p className="text-sm font-semibold text-gray-300 mb-4">How well did you know this?</p>
                          <div className="grid grid-cols-4 gap-3">
                            <button onClick={() => handleRateReview(1)} className="bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-800/50 py-3 rounded-xl font-bold transition-colors">
                              Again
                            </button>
                            <button onClick={() => handleRateReview(3)} className="bg-orange-900/40 hover:bg-orange-800/60 text-orange-300 border border-orange-800/50 py-3 rounded-xl font-bold transition-colors">
                              Hard
                            </button>
                            <button onClick={() => handleRateReview(4)} className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-800/50 py-3 rounded-xl font-bold transition-colors">
                              Good
                            </button>
                            <button onClick={() => handleRateReview(5)} className="bg-green-900/40 hover:bg-green-800/60 text-green-300 border border-green-800/50 py-3 rounded-xl font-bold transition-colors">
                              Easy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 bg-green-900/20 border border-green-800/50 rounded-xl p-4 text-center">
                          <p className="text-green-300 font-medium">
                            ✓ Scheduled for next review — {reviewProblem?.srs ? new Date(reviewProblem.srs.nextReview).toLocaleDateString() : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {rated && (
                    <div className="mt-8 flex justify-end">
                      <button onClick={handleGenerateReview} className="bg-gray-800 hover:bg-purple-900 text-white px-6 py-3 rounded-xl font-bold transition-all border border-gray-700 hover:border-purple-500">
                        🔄 Review Next Item
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}