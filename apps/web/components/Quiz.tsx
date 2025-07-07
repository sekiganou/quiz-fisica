import { Question } from "@/app/actions/questions";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";
import { shuffleArray } from "@/lib/shuffleArray";
import { getLastQuiz, saveLastQuiz } from "@/app/actions/stats";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { renderQuestion } from "./renderQuestion";
import { GreenTick } from "./GreenTick";
import { RedCross } from "./RedCross";

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

function mapCorrectAnswers(questions: Question[]): Map<number, string> {
  const correctAnswerMapping = new Map<number, string>();
  questions.forEach((question) => {
    getAllTrueAnswersHelper(question, correctAnswerMapping);
  });
  return correctAnswerMapping;
}

function getAllTrueAnswersHelper(
  question: Question,
  correctAnswerMapping: Map<number, string>
) {
  question.answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      correctAnswerMapping.set(question.id, answer.answerText);
    }
  });
  if (question.followUpQuestion) {
    getAllTrueAnswersHelper(question.followUpQuestion, correctAnswerMapping);
  }
}

export default function Quiz({
  questions,
  totalQuestions,
  handleReset,
}: {
  questions: Question[];
  totalQuestions?: number;
  handleReset: () => void;
}) {
  let shuffledQuestions = shuffleQuestions(questions);
  shuffledQuestions = shuffledQuestions.slice(
    0,
    totalQuestions || shuffledQuestions.length
  );
  // const [correctUserAnswers, setcorrectUserAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<Map<number, string>>(
    mapCorrectAnswers(shuffledQuestions)
  );
  const totalAnswers = correctAnswers.size;
  saveLastQuiz(shuffledQuestions, 0, totalAnswers);

  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(
    shuffledQuestions[currentQuestionIndex]
  );
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [correctUserAnswers, setCorrectUserAnswers] = useState(0);
  const [wrongUserAnswers, setWrongUserAnswers] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(
    new Map()
  );

  const handleMoveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCurrentQuestion(shuffledQuestions[currentQuestionIndex]);
    setShowFollowUp(false);
    form.reset();
  };

  function buildSchemaFromQuestion(
    question: Question,
    fieldName: string,
    schema: Record<string, ZodTypeAny> = {}
  ): Record<string, ZodTypeAny> {
    // Add the main question to the schema
    schema[fieldName] = z.enum(
      question.answers.map((a) => a.answerText) as [string, ...string[]],
      {
        required_error: "Rispondi a tutte le domande.",
      }
    );

    // Recurse into follow-up questions if any
    if (question.followUpQuestion) {
      buildSchemaFromQuestion(
        question.followUpQuestion,
        `${question.followUpQuestion.id}`,
        schema
      );
    }

    return schema;
  }

  const rawSchema = buildSchemaFromQuestion(
    currentQuestion!,
    `${currentQuestion!.id}`
  );
  const FormSchema = z.object(rawSchema);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    let correct = 0;
    let wrong = 0;

    Object.entries(data).forEach(([questionId, answer]) => {
      const correctAnswer = correctAnswers.get(Number(questionId));
      if (answer === correctAnswer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });

    setCorrectUserAnswers((prev) => prev + correct);
    setWrongUserAnswers((prev) => prev + wrong);

    setCurrentPercent(
      Math.round((currentQuestionIndex / shuffledQuestions.length) * 100)
    );

    setShowFollowUp(true);
  };

  return (
    <>
      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">
        Quiz causale ({totalQuestions} domande)
      </h2>
      <div className="flex items-center gap-4 mb-2">
        <Progress value={currentPercent} className="flex-1" />
        <div className="flex items-center gap-2">
          <GreenTick />
          <span className="text-green-600 font-semibold">
            {correctUserAnswers}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RedCross />
          <span className="text-red-600 font-semibold">{wrongUserAnswers}</span>
        </div>
      </div>
      <h3 className="text-md font-medium mb-4">
        Domanda {currentQuestionIndex} di {totalQuestions}
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            {currentQuestion &&
              renderQuestion(
                currentQuestion,
                `${currentQuestion.id}`,
                form,
                correctAnswers,
                showFollowUp
              )}
          </Card>

          <div className="mt-4 flex justify-between mb-4">
            <Button variant={"outline"} type="submit" disabled={showFollowUp}>
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
            <Button variant={"destructive"} onClick={handleReset}>
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
        </form>
      </Form>
    </>
  );
}
