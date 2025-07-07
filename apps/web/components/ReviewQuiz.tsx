import { Question } from "@/app/actions/questions";
import { getLastQuiz, UserAnswer } from "@/app/actions/stats";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import Image from "next/image";
import { GreenTick } from "./GreenTick";
import { RedCross } from "./RedCross";
import { Label } from "@workspace/ui/components/label";
import { ReactNode, useState } from "react";
import { Button } from "@workspace/ui/components/button";

export default function ReviewQuiz() {
  const [quiz] = useState(getLastQuiz());

  const renderQuestion = (
    question: Question,
    userAnswer: UserAnswer
  ): ReactNode => {
    if (!question) return;

    return (
      <>
        <CardHeader>{question.questionText}</CardHeader>
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
        <CardContent>
          <RadioGroup disabled={true} defaultValue={userAnswer.answerText}>
            {question.answers.map((answer, index) => {
              const isCorrect = answer.isCorrect;
              const isSelected = userAnswer.isCorrect;
              console.log(
                `for question id '${question.id}', user answer is '${userAnswer.answerText}', answer is '${answer.answerText}', isCorrect: '${isCorrect}', isSelected: '${isSelected}'`
              );
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
        </CardContent>
        {question.followUpQuestion && (
          <>
            <hr className="my-4 ml-4 mr-4" />
            {renderQuestion(
              question.followUpQuestion,
              quiz!.userAnswers[question.followUpQuestion.id]!
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">Revisione del Quiz</h2>
      {quiz &&
        quiz.questions.map((question, index) => (
          <div key={index}>
            <h3 className="text-md font-medium mb-4">
              Domanda {index + 1} di {quiz.questions.length}
            </h3>
            <Card className="mb-4">
              {renderQuestion(question, quiz.userAnswers[index]!)}
            </Card>
          </div>
        ))}
      <div className="mb-4 flex justify-center">
        <Button variant={"outline"}>Chiudi</Button>
      </div>
    </>
  );
}
