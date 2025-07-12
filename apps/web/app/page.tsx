"use client";

import Quiz from "@/components/Quiz";
import Stats from "@/components/Stats";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";
import { statsStorage } from "./actions/stats";
import { ChooseTopics } from "@/components/ChooseTopics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { IconArrowsShuffle, IconChartBar, IconChartDots2, IconInfinity, IconList, IconTrashFilled, IconTrashX } from "@tabler/icons-react";

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
          <Button variant="outline" onClick={handleOpenStats}>
            <IconChartDots2 />
            Statistiche
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <IconTrashFilled />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Conferma Reset</AlertDialogTitle>
                <AlertDialogDescription>
                  Sei sicuro di voler resettare le statistiche? Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetStats}>Conferma</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
      <main className="flex flex-col items-center w-full mt-8" >
        <p className="mb-6 text-lg text-center max-w-xl">
          Metti alla prova le tue conoscenze con tutte le domande reali d'esame!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={handleOpenRandomQuiz} disabled={locked}>
            <IconArrowsShuffle />
            Domande Casuali
          </Button>
          <Button disabled={locked} onClick={handleOpenChooseTopicQuiz}>
            <IconList />
            Scegli Argomento
          </Button>
          <Button onClick={handleOpenAllQuiz} disabled={locked}>
            <IconInfinity />
            Tutti i Quiz
          </Button>
        </div>
        <div className="mt-6 w-full max-w-2xl px-2 sm:px-0">
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
        <footer className="my-8 w-full flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              <span className="font-semibold text-gray-700">Quiz Fisica</span> &mdash; Made by <a href="https://github.com/sekiganou" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                sekiganou
              </a>
            </span>
          </div>
        </footer>
      </main >
    </>
  );
}
