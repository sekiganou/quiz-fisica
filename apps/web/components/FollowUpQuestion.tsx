// filepath: /root/quiz-fisica/apps/web/components/FollowUpQuestion.tsx
import { Question } from "@/app/actions/questions";
import { CardHeader, CardContent } from "@workspace/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";

export function FollowUpQuestion({ question }: { question: Question | null }) {
  if (!question) return null;

  return (
    <>
      <hr className="my-4 ml-4 mr-4" />
      <CardHeader>{question.questionText}</CardHeader>
      <CardContent>
        <RadioGroup defaultValue="comfortable">
          {question.answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-3">
              <RadioGroupItem
                value={answer.answerText}
                id={`answer-${index}`}
              />
              <Label htmlFor={`answer-${index}`}>{answer.answerText}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      {/* Recurse if more follow-ups exist */}
      <FollowUpQuestion question={question.followUpQuestion} />
    </>
  );
}
