"use client";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wrongNotes") || "[]");
    setNotes(saved);
  }, []);

  return (
    <main className="min-h-screen p-10 max-w-5xl mx-auto bg-gray-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📂 My Wrong Answer Notes</h1>
        <a href="/" className="bg-blue-600 px-6 py-2 rounded-lg">← Back to Home</a>
      </div>
      {notes.map((n, i) => (
        <div key={i} className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-4">
          <h3 className="text-blue-400 font-bold">{n.category} ({n.date})</h3>
          <p className="mt-2 text-gray-300">Q: {n.question}</p>
          <p className="mt-2 text-red-400">Mistake: {n.wrongSolution}</p>
          <p className="mt-2 text-green-400">Analysis: {n.analysis}</p>
        </div>
      ))}
    </main>
  );
}