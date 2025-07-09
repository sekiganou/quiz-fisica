"use client";

import Quiz from "@/components/Quiz";
import ReviewQuiz from "@/components/ReviewQuiz";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [openRandomQuiz, setOpenRandomQuiz] = useState(false);
  const [openAllQuiz, setOpenAllQuiz] = useState(false);

  const [locked, setLocked] = useState(false);

  const handleOpenRandomQuiz = () => {
    setOpenRandomQuiz(true);
    setLocked(true);
  };

  const handleOpenAllQuiz = () => {
    setOpenAllQuiz(true);
    setLocked(true);
  };

  const handleReset = () => {
    setOpenRandomQuiz(false);
    setOpenAllQuiz(false);
    setLocked(false);
    setQuestions([]);
  };

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    }

    fetchQuestions();
  }, [locked]);
  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Quiz Física</h1>
        <div className="flex gap-2">
          <Button variant="outline">Statistiche</Button>
          <Button variant="destructive">Reset</Button>
        </div>
      </header>
      <main className="flex flex-col items-center w-full mt-8">
        <p className="mb-6 text-lg text-center max-w-xl">
          Metti alla prova le tue conoscenze con tutte le domande reali d'esame!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={handleOpenRandomQuiz} disabled={locked}>
            <span className="mr-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 4v16h16V4H4zm2 2h12v12H6V6zm2 2v8h8V8H8z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Domande Casuali
          </Button>
          <Button disabled={locked}>
            <span className="mr-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.93V20h-2v-.07A8.001 8.001 0 014.07 13H4v-2h.07A8.001 8.001 0 0111 4.07V4h2v.07A8.001 8.001 0 0119.93 11H20v2h-.07A8.001 8.001 0 0113 19.93z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Scegli Argomento
          </Button>
          <Button onClick={handleOpenAllQuiz} disabled={locked}>
            <span className="mr-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Tutti i Quiz
          </Button>
          <Button disabled={locked}>
            <span className="mr-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
            Inizia da Domanda
          </Button>
        </div>
        {openRandomQuiz && (
          <div className="mt-6 w-full max-w-2xl">
            <Quiz
              questions={questions}
              quizQuestions={2}
              handleClose={() => setOpenRandomQuiz(false)}
              handleReset={handleReset}
            />
          </div>
        )}
        {openAllQuiz && (
          <div className="mt-6 w-full max-w-2xl">
            <Quiz
              questions={questions}
              quizQuestions={questions.length}
              handleClose={() => setOpenAllQuiz(false)}
              handleReset={handleReset}
            />
          </div>
        )}
      </main>
    </>
  );
}
