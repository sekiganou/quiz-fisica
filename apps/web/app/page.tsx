"use client";

import { GreenTick } from "@/components/icons/GreenTick";
import Quiz from "@/components/Quiz";
import ReviewQuiz from "@/components/ReviewQuiz";
import Stats from "@/components/Stats";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { useEffect, useState } from "react";
import { statsStorage } from "./actions/stats";
import { ChooseTopics } from "@/components/ChooseTopics";

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [openRandomQuiz, setOpenRandomQuiz] = useState(false);
  const [openAllQuiz, setOpenAllQuiz] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [openChooseTopicQuiz, setOpenChooseTopicQuiz] = useState(false);

  const [locked, setLocked] = useState(false);

  const handleResetStats = () => {
    statsStorage.clear();
    setOpenStats(false);
  }

  const handleOpenChooseTopicQuiz = () => {
    setOpenChooseTopicQuiz(true);
    setOpenRandomQuiz(false);
    setOpenAllQuiz(false);
    setOpenStats(false);
    setLocked(true);
  };

  const handleOpenRandomQuiz = () => {
    setOpenRandomQuiz(true);
    setOpenStats(false);
    setOpenChooseTopicQuiz(false);
    setLocked(true);
  };

  const handleOpenStats = () => {
    setOpenStats(true);
    setOpenAllQuiz(false);
    setOpenRandomQuiz(false);
    setOpenChooseTopicQuiz(false);
    setLocked(false);
  };

  const handleOpenAllQuiz = () => {
    setOpenAllQuiz(true);
    setOpenStats(false);
    setOpenRandomQuiz(false);
    setOpenChooseTopicQuiz(false);
    setLocked(true);
  };

  const handleResetQuestions = () => {
    setOpenRandomQuiz(false);
    setOpenAllQuiz(false);
    setOpenStats(false);
    setOpenChooseTopicQuiz(false);
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
        <h1 className="text-2xl font-bold">Quiz Fisica</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenStats}>Statistiche</Button>
          <Button variant="destructive" onClick={handleResetStats}>Reset</Button>
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
          <Button disabled={locked} onClick={handleOpenChooseTopicQuiz}>
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
        </div>
        <div className="mt-6 w-full max-w-2xl">
          {openRandomQuiz && (
            <Quiz
              questions={questions}
              quizQuestions={2}
              handleReset={handleResetQuestions}
            />
          )}
          {openAllQuiz && (
            <Quiz
              questions={questions}
              quizQuestions={questions.length}
              handleReset={handleResetQuestions}
            />
          )}
          {openChooseTopicQuiz && (
            <ChooseTopics questions={questions} handleReset={handleResetQuestions} />
          )}
          {openStats && (
            <Stats />
          )}
        </div>
      </main >
    </>
  );
}
