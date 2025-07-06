import { Question } from "@/app/actions/questions";
import { Card, CardHeader } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { FollowUpQuestion } from "./FollowUpQuestion";
import { Form } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { MainQuestion } from "./MainQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

function shuffleQuestions(questions: Question[]): Question[] {
  const shuffledQuestions = shuffleArray(
    questions.map((question) => shuffleAnswers({ question }))
  );
  return shuffledQuestions;
}

function shuffleAnswers({ question }: { question: Question }): Question {
  if (!question || !question.answers || question.answers.length === 0) {
    return { ...question };
  }
  const shuffledAnswers = shuffleArray(question.answers);
  return {
    ...question,
    answers: shuffledAnswers,
    followUpQuestion: question.followUpQuestion
      ? shuffleAnswers({ question: question.followUpQuestion })
      : null,
  };
}

function mapCorrectAnswers(questions: Question[]): Map<number, number> {
  const correctAnswerMapping = new Map<number, number>();
  questions.forEach((question) => {
    getAllTrueAnswersHelper(question, correctAnswerMapping);
  });
  return correctAnswerMapping;
}

function getAllTrueAnswersHelper(
  question: Question,
  correctAnswerMapping: Map<number, number>
) {
  question.answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      correctAnswerMapping.set(question.id, index);
    }
  });
  if (question.followUpQuestion) {
    getAllTrueAnswersHelper(question.followUpQuestion, correctAnswerMapping);
  }
}

export default function RandomQuiz({ questions }: { questions: Question[] }) {
  const shuffledQuestions = shuffleQuestions(questions);
  const correctAnswersMapping = mapCorrectAnswers(shuffledQuestions);
  let totalQuestions = questions.length;
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(shuffledQuestions[0]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const answerIndexes = Array.from(correctAnswersMapping.values()).map(String);

  const handleMoveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setCurrentQuestion(shuffledQuestions[nextIndex]);
    setCurrentPercent(Math.round((nextIndex / shuffledQuestions.length) * 100));
  };

  const answersText: string[] = [];
  const getAnswerText = (question: Question | null) => {
    if (!question) return;
    question.answers.forEach((answer) => {
      answersText.push(answer.answerText);
      getAnswerText(question.followUpQuestion || null);
    });
  };

  const FormSchema = z.object({
    type: z.enum(answersText as [string, ...string[]], {
      required_error: "Rispondi a tutte le domande.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  console.log("shuffledQuestions", shuffledQuestions);
  console.log("correctAnswersMapping", correctAnswersMapping);

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
        Domanda {currentQuestionIndex} di {totalQuestions}
      </h3>
      <Form {...form}>
        <form>
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
            {currentQuestion && <MainQuestion question={currentQuestion} />}
            {currentQuestion?.followUpQuestion && (
              <FollowUpQuestion question={currentQuestion.followUpQuestion} />
            )}
          </Card>
        </form>
      </Form>
      <div className="mt-4 flex justify-between mb-4">
        <Button
          variant={"outline"}
          type="submit"
          onSubmit={() => setShowFollowUp(true)}
        >
          <span className="mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M7.629 15.314a1 1 0 0 1-1.414 0l-3.536-3.535a1 1 0 1 1 1.414-1.415l2.829 2.829 6.364-6.364a1 1 0 1 1 1.414 1.415l-7.071 7.07z"
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
        {showFollowUp && (
          <Button
            variant="default"
            onClick={handleMoveToNextQuestion}
            className="mr-32"
          >
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
            Prossima Domanda
          </Button>
        )}
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
