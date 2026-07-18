export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b">

      <h1 className="text-2xl font-bold">
        AcePrep AI
      </h1>

      <div className="flex gap-6">
        <a href="/">
          Home
        </a>

        <a href="/ai">
          AI Tutor
        </a>

        <a href="/notebook">
          Notebook
        </a>

        <a href="/dashboard">
          Dashboard
        </a>
      </div>

    </nav>
  );
}