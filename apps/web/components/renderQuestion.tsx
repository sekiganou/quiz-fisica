import { Question } from "@/app/actions/questions";
import { CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { IconCheck, IconX } from "@tabler/icons-react";

export const renderQuestion = (
  question: Question,
  fieldName: string,
  form: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    {
      [x: string]: any;
    }
  >,
  correctAnswers: Map<number, string>,
  disabled: boolean = false
) => {
  const selectedAnswer = form.getValues(fieldName);
  const correctAnswer = correctAnswers.get(question.id) || "";
  return (
    <>
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <CardHeader>{question.content}</CardHeader>
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
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  {question.answers.map((answer, index) => {
                    const isCorrect = correctAnswer === answer.answerText;
                    const isSelected = selectedAnswer === answer.answerText;
                    return (
                      <div className="flex items-center gap-3" key={index}>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value={answer.answerText}
                              id={`${fieldName}-answer-${index}`}
                            />
                          </FormControl>
                        </FormItem>
                        <Label htmlFor={`${fieldName}-answer-${index}`}>
                          {answer.answerText}
                        </Label>
                        {disabled && isCorrect && <IconCheck className="text-green-600" />}
                        {disabled && isSelected && !isCorrect && <IconX className="text-red-600" />}
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage className="ml-4 mt-2" />
            </CardContent>

            {question.followUpQuestion && (
              <>
                <hr className="my-4 ml-4 mr-4" />
                {renderQuestion(
                  question.followUpQuestion,
                  `${question.followUpQuestion.id}`,
                  form,
                  correctAnswers,
                  disabled
                )}
              </>
            )}
          </FormItem>
        )}
      />
    </>
  );
};
