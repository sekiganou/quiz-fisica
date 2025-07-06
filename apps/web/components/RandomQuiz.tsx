import { Question } from "@/app/actions/questions";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { FollowUpQuestion } from "./FollowUpQuestion";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[j];
    newArray[j] = newArray[i] as T;
    newArray[i] = temp as T;
  }
  return newArray;
}

export default function RandomQuiz({ questions }: { questions: Question[] }) {
  const shuffledQuestions = shuffleArray(questions);
  let totalQuestions = questions.length;
  const [currentPercent, setCurrentPercent] = useState(0);
  const [counterQuestions, setCounterQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(shuffledQuestions[0]);

  const handleValidateQuestion = () => {};

  console.log("shuffledQuestions", shuffledQuestions);

  return (
    <>
      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">
        Quiz causale ({totalQuestions} domande)
      </h2>
      <div className="flex items-center gap-4 mb-2">
        <Progress value={currentPercent} className="flex-1" />
        <div className="flex items-center gap-2">
          <svg width="20" height="20" fill="green" viewBox="0 0 20 20">
            <path d="M7.629 15.314a1 1 0 0 1-1.414 0l-3.536-3.535a1 1 0 1 1 1.414-1.415l2.829 2.829 6.364-6.364a1 1 0 1 1 1.414 1.415l-7.071 7.07z" />
          </svg>
          <span className="text-green-600 font-semibold">
            {/* correctCount */}0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="20" height="20" fill="red" viewBox="0 0 20 20">
            <path d="M10 8.586l4.95-4.95a1 1 0 1 1 1.414 1.415L11.414 10l4.95 4.95a1 1 0 1 1-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 1 1-1.414-1.415L8.586 10l-4.95-4.95A1 1 0 1 1 5.05 3.636L10 8.586z" />
          </svg>
          <span className="text-red-600 font-semibold">
            {/* wrongCount */}0
          </span>
        </div>
      </div>
      <h3 className="text-md font-medium mb-4">
        Domanda {counterQuestions} di {totalQuestions}
      </h3>

      <Card>
        <CardHeader>{currentQuestion?.questionText}</CardHeader>
        {currentQuestion?.image && (
          <div className="flex justify-center mb-4">
            <Image
              src={currentQuestion.image!}
              alt="Question Image"
              width={500}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}
        <CardContent>
          <RadioGroup defaultValue="comfortable">
            {currentQuestion?.answers.map((answer, index) => (
              <div className="flex items-center gap-3" key={index}>
                <RadioGroupItem
                  value={answer.answerText}
                  id={`answer-${index}`}
                />
                <Label htmlFor={`answer-${index}`}>{answer.answerText}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        {currentQuestion?.followUpQuestion && (
          <FollowUpQuestion question={currentQuestion.followUpQuestion} />
        )}
      </Card>
      <div className="mt-4 flex justify-between mb-4">
        <Button variant={"outline"} onClick={handleValidateQuestion}>
          <span className="mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 5l8 7-8 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          Invia Risposta
        </Button>
        <Button variant={"destructive"}>
          <span className="mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Abbandona
        </Button>
      </div>
    </>
  );
}
