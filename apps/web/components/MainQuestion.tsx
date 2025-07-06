import { Question } from "@/app/actions/questions";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { CardContent } from "@workspace/ui/components/card";

export function MainQuestion({ question }: { question: Question }) {
  return (
    <>
      <CardContent>
        <RadioGroup defaultValue="comfortable">
          {question.answers.map((answer, index) => (
            <div className="flex items-center gap-3" key={index}>
              <RadioGroupItem
                value={answer.answerText}
                id={`question-${question.id}-answer-${index}`}
              />
              <Label htmlFor={`question-${question.id}-answer-${index}`}>
                {answer.answerText}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </>
  );
}
