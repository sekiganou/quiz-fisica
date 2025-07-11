import { Question, UserAnswer } from "@/app/actions/questions";
import { Card } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
} from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";
import { shuffleArray } from "@/lib/shuffleArray";
import { renderQuestion } from "./renderQuestion";
import { GreenTick } from "./icons/GreenTick";
import { RedCross } from "./icons/RedCross";
import ReviewQuiz from "./ReviewQuiz";
import { QuizStats, statsStorage } from "@/app/actions/stats";

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
    mapCorrectAnswersHelper(question, correctAnswerMapping);
  });
  return correctAnswerMapping;
}

function mapCorrectAnswersHelper(
  question: Question,
  correctAnswerMapping: Map<number, string>
) {
  question.answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      correctAnswerMapping.set(question.id, answer.answerText);
    }
  });
  if (question.followUpQuestion) {
    mapCorrectAnswersHelper(question.followUpQuestion, correctAnswerMapping);
  }
}

export default function Quiz({
  questions,
  quizQuestions,
  handleReset,
}: {
  questions: Question[];
  quizQuestions?: number;
  handleReset: () => void;
}) {
  const [shuffledQuestions] = useState(
    shuffleQuestions(questions).slice(0, quizQuestions || questions.length)
  );

  const [quizStats, setQuizStats] = useState<QuizStats>({
    date: new Date(),
    topics: [],
    totalCorrectAnswers: 0,
    totalAnswers: 0,
  });

  const [correctAnswers] = useState<Map<number, string>>(
    mapCorrectAnswers(shuffledQuestions)
  );

  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [correctUserAnswers, setCorrectUserAnswers] = useState(0);
  const [wrongUserAnswers, setWrongUserAnswers] = useState(0);

  const [openReview, setOpenReview] = useState(false);

  const [userAnswers, setUserAnswers] = useState<Array<UserAnswer>>([]);

  const isQuizCompleted = currentQuestionIndex >= shuffledQuestions.length - 1;

  const handleMoveToReview = () => {
    setCurrentPercent(100);
    setOpenReview(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    statsStorage.add(quizStats)
  };

  const handleMoveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setShowNextQuestion(false);
    form.reset();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }); // Ensure the form is reset before scrolling
  };

  function buildSchemaFromQuestion(
    question: Question,
    fieldName: string,
    schema: Record<string, ZodTypeAny> = {}
  ): Record<string, ZodTypeAny> {
    schema[fieldName] = z.enum(
      question.answers.map((a) => a.answerText) as [string, ...string[]],
      {
        required_error: "Rispondi a tutte le domande.",
      }
    );

    if (question.followUpQuestion) {
      buildSchemaFromQuestion(
        question.followUpQuestion,
        `${question.followUpQuestion.id}`,
        schema
      );
    }

    return schema;
  }

  // Only create schema if we have a valid current question
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const rawSchema = currentQuestion
    ? buildSchemaFromQuestion(currentQuestion, `${currentQuestion.id}`)
    : {};
  const FormSchema = z.object(rawSchema);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    let countCorrect = 0;
    let countWrong = 0;
    let userAnswersMap = new Array<UserAnswer>();

    Object.entries(data).forEach(([questionId, answer]) => {
      const correctAnswer = correctAnswers.get(Number(questionId));
      if (answer === correctAnswer) {
        userAnswersMap.push({
          questionId: Number(questionId),
          answerText: answer,
          isCorrect: true,
        });
        countCorrect += 1;
      } else {
        countWrong += 1;
        userAnswersMap.push({
          questionId: Number(questionId),
          answerText: answer,
          isCorrect: false,
        });
      }
    });

    setCorrectUserAnswers((prev) => prev + countCorrect);
    setWrongUserAnswers((prev) => prev + countWrong);

    setCurrentPercent(
      Math.round((currentQuestionIndex + 1 / shuffledQuestions.length) * 100)
    );

    setShowNextQuestion(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setQuizStats((prev) => ({
      ...prev,
      totalCorrectAnswers: prev.totalCorrectAnswers + countCorrect,
      totalAnswers: prev.totalAnswers + countCorrect + countWrong,
      topics: [
        ...prev.topics,
        {
          title: currentQuestion?.title ?? "",
          totalCorrectAnswers: countCorrect,
          totalAnswers: countCorrect + countWrong,
        },
      ],
    }));

    setUserAnswers((prev) => {
      return [...prev, ...userAnswersMap];
    });
  };

  return (
    <>
      {!openReview &&
        <>
          <h2 className="text-xl font-semibold mb-2">
            Quiz casuale ({quizQuestions} domande)
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
            Domanda {currentQuestionIndex + 1} di {quizQuestions}
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
                    showNextQuestion
                  )}
              </Card>

              <div className="mt-4 flex justify-between mb-4">
                <Button
                  variant={"outline"}
                  type="submit"
                  disabled={showNextQuestion}
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
                {!isQuizCompleted && showNextQuestion && (
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
                    Domanda Successiva
                  </Button>
                )}
                {isQuizCompleted && showNextQuestion && (
                  <Button
                    variant="default"
                    onClick={handleMoveToReview}
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
                    Rivedi Risultati
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
        </>}
      {openReview && (
        <div className="mt-6 w-full max-w-2xl">
          <ReviewQuiz
            questions={shuffledQuestions}
            userAnswers={userAnswers}
            handleReset={handleReset}
          />
        </div>
      )}
    </>
  );
}
