import { Question, UserAnswer } from "@/app/actions/questions";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import Image from "next/image";
import { Label } from "@workspace/ui/components/label";
import { ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function ReviewQuiz({
  questions,
  userAnswers,
  handleReset,
}: {
  questions: Question[];
  userAnswers: UserAnswer[];
  handleReset: () => void;
}) {
  const correctUserAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const wrongUserAnswers = userAnswers.length - correctUserAnswers;
  const handleClose = () => {
    handleReset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const renderQuestion = (
    question: Question,
    userAnswer: UserAnswer
  ): ReactNode => {
    if (!question || !userAnswer) return;

    return (
      <>
        <CardHeader>{question.content}</CardHeader>
        <CardContent>
          {question.image && (
            <div className="flex justify-center mb-4">
              <Image
                src={question.image}
                alt="Question Image"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          )}
          <div>
            <RadioGroup disabled={true} defaultValue={userAnswer.answerText}>
              {question.answers.map((answer, index) => {
                const isCorrect = answer.isCorrect;
                const isSelected =
                  !userAnswer.isCorrect &&
                  userAnswer.answerText === answer.answerText;
                return (
                  <div className="flex items-center gap-3" key={index}>
                    <RadioGroupItem
                      value={answer.answerText}
                      id={`review-${question.id}-answer-${index}`}
                    />
                    <Label htmlFor={`review-${question.id}-answer-${index}`}>
                      {answer.answerText}
                    </Label>
                    {isCorrect && <IconCheck className="text-green-600" />}
                    {isSelected && !isCorrect && <IconX className="text-red-600" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </CardContent>
        {question.followUpQuestion && (
          <>
            {renderQuestion(
              question.followUpQuestion,
              userAnswers.find(
                (userAnswer) =>
                  userAnswer.questionId == question.followUpQuestion!.id
              )!
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-2">
        <h2 className="text-xl font-semibold mb-2">Revisione del Quiz</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600">
            <IconCheck />
            <span className="font-semibold">{correctUserAnswers}</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <IconX />
            <span className="font-semibold">{wrongUserAnswers}</span>
          </div>
        </div>
      </div>
      <hr className="my-4 ml-4 mr-4" />
      {questions.map((question, index) => (
        <div key={index} className="mb-2">
          <h3 className="text-md font-medium mb-4">
            Domanda {index + 1} di {questions.length} - {question.topic}
          </h3>
          <Card className="mb-4">
            {renderQuestion(
              question,
              userAnswers.find(
                (userAnswer) => userAnswer.questionId == question.id
              )!
            )}
          </Card>
        </div>
      ))}
      <div className="mb-4 flex justify-center">
        <Button
          variant={"outline"}
          onClick={handleClose}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          <IconX />
          Chiudi
        </Button>
      </div>
    </>
  );
}
