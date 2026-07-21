import PracticeTestGenerator from "@/components/PracticeTestGenerator";

export default function PracticeTestPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6">
        <a href="/" className="text-blue-400 text-sm hover:underline">
          ← Back to Home
        </a>
      </div>
      <PracticeTestGenerator />
    </main>
  );
}