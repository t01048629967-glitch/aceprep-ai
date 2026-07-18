"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function MainContent() {
  const [view, setView] = useState("dashboard"); // 기본 화면을 대시보드로 변경할 수도 있습니다. (현재는 앱 켜면 대시보드가 먼저 보임)

  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState("");
  const [wrongSolution, setWrongSolution] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  // Daily Review용 상태
  const [reviewProblem, setReviewProblem] = useState(null);
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [userReviewAnswer, setUserReviewAnswer] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    const savedNotes = JSON.parse(localStorage.getItem("wrongNotes") || "[]");
    setNotes(savedNotes);
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleAskAI = async (action) => {
    if (!question.trim()) return alert("Please enter a problem!");
    setLoading(true);
    setResponse(""); 
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, wrongSolution, action }),
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (e) { 
      setResponse("An error occurred. Please try again."); 
    }
    setLoading(false);
  };

  const handleSaveNote = () => {
    if (!question || !response) return alert("Both a problem and an AI response are required to save.");
    
    const newNote = {
      id: Date.now(),
      question,
      wrongSolution,
      response,
      date: new Date().toLocaleString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("wrongNotes", JSON.stringify(updatedNotes));
    
    setView("notes");
  };

  const handleDeleteNote = (e, id) => {
    e.stopPropagation(); 
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("wrongNotes", JSON.stringify(updatedNotes));
  };

  const handleLoadNote = (note) => {
    setQuestion(note.question);
    setWrongSolution(note.wrongSolution || "");
    setResponse(note.response);
    setView("home");
  };

  const handleGenerateReview = async () => {
    if (notes.length === 0) {
      alert("You need at least one saved note to generate a review question!");
      return;
    }
    
    setView("review");
    setIsReviewLoading(true);
    setReviewQuestion("");
    setUserReviewAnswer("");
    setReviewFeedback("");
    
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setReviewProblem(randomNote);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: `Create a similar but slightly different practice problem to test my understanding of this topic. Provide ONLY the new problem text. DO NOT provide the solution yet.\n\nOriginal problem concept: ${randomNote.question}`, 
          wrongSolution: "", 
          action: "solve" 
        }),
      });
      const data = await res.json();
      setReviewQuestion(data.answer);
    } catch (e) { 
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
          action: "analyze" 
        }),
      });
      const data = await res.json();
      setReviewFeedback(data.answer);
    } catch (e) { 
      setReviewFeedback("Failed to evaluate your answer. Please try again."); 
    }
    setIsReviewLoading(false);
  };

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
            <button onClick={handleGenerateReview} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === "review" ? "bg-purple-600 text-white" : "bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-800/50"}`}>🎯 Daily Review</button>

            {user ? (
              <button onClick={() => signOut(auth)} className="bg-red-900/50 hover:bg-red-800 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-800/50 ml-2">Logout</button>
            ) : (
              <button onClick={handleLogin} className="bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors ml-2">Google Login</button>
            )}
          </div>
        </nav>

        {/* 0. 대시보드 화면 (통계 및 요약) */}
        {view === "dashboard" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>📊</span> Welcome back{user ? `, ${user.displayName.split(' ')[0]}` : ""}!
            </h2>
            
            {/* 핵심 지표 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-green-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Notes</p>
                <p className="text-5xl font-extrabold text-white">{notes.length}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-purple-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Review Status</p>
                <p className="text-3xl font-extrabold text-purple-400 mt-2">{notes.length > 0 ? "Ready 🎯" : "Needs Notes"}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-center items-center text-center hover:border-orange-500 transition-colors">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Study Streak</p>
                <p className="text-4xl font-extrabold text-orange-400 flex items-center gap-2">🔥 1 <span className="text-xl">Day</span></p>
              </div>
            </div>

            {/* 최근 학습한 문제 요약 */}
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
                      <span className="text-xs text-gray-500 whitespace-nowrap">{note.date.split(',')[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. 홈 화면 (새로운 문제 풀이) */}
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
            {response && (
              <div className="mt-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white ml-2">AI's Response</h3>
                  <button onClick={handleSaveNote} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-900/20">Save to Notes</button>
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
            {notes.length === 0 ? (
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
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button onClick={handleGenerateReview} className="bg-gray-800 hover:bg-purple-900 text-white px-6 py-3 rounded-xl font-bold transition-all border border-gray-700 hover:border-purple-500">
                      🔄 Try Another Problem
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}