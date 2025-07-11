import { Question, UserAnswer } from "@/app/actions/questions";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import Image from "next/image";
import { GreenTick } from "./icons/GreenTick";
import { RedCross } from "./icons/RedCross";
import { Label } from "@workspace/ui/components/label";
import { ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";

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
  }
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
                const isSelected = !userAnswer.isCorrect && userAnswer.answerText === answer.answerText;
                return (
                  <div className="flex items-center gap-3" key={index}>
                    <RadioGroupItem
                      value={answer.answerText}
                      id={`review-${question.id}-answer-${index}`}
                    />
                    <Label htmlFor={`review-${question.id}-answer-${index}`}>
                      {answer.answerText}
                    </Label>
                    {isCorrect && <GreenTick />}
                    {isSelected && !isCorrect && <RedCross />}
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
              userAnswers.find(userAnswer => userAnswer.questionId == question.followUpQuestion!.id)!
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
      </div>
      <hr className="my-4 ml-4 mr-4" />
      {questions.map((question, index) => (
        <div key={index} className="mb-2" >
          <h3 className="text-md font-medium mb-4" >
            Domanda {index + 1} di {questions.length}
          </h3 >
          <Card className="mb-4">
            {renderQuestion(question, userAnswers.find(userAnswer => userAnswer.questionId == question.id)!)}
          </Card>
        </div >
      ))
      }
      <div className="mb-4 flex justify-center">
        <Button variant={"outline"} onClick={handleClose}>
          Chiudi
        </Button>
      </div >

    </>
  );
}
