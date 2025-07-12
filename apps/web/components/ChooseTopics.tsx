"use client"

import { Question } from "@/app/actions/questions";
import { useState } from "react";
import Quiz from "./Quiz";
import { Button } from "@workspace/ui/components/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { IconPlayerPlayFilled, IconX } from "@tabler/icons-react";

export const ChooseTopics = (
  { questions,
    handleReset,
    setLocked
  }: {
    questions: Question[],
    setLocked: (locked: boolean) => void,
    handleReset: () => void
  }) => {
  const [topics] = useState<string[]>(questions.map(question => question.title));
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openChooseTopics, setOpenChooseTopics] = useState(true);
  const [openQuiz, setOpenQuiz] = useState(false);

  const FormSchema = z.object({
    topics: z.array(z.string()).refine((value) => value.some((topic) => topic), {
      message: "Seleziona almeno un argomento.",
    }),
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSelectedTopics(data.topics);
    setOpenChooseTopics(false);
    setOpenQuiz(true);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topics: topics,
    },
  })

  return (
    <div>
      {openChooseTopics && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Scegli gli argomenti dl quiz
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => {
                  const allSelected = topics.every((topic) => field.value?.includes(topic));
                  const isIndeterminate =
                    field.value?.length > 0 && !allSelected;

                  const handleSelectAll = (checked: boolean) => {
                    if (checked) {
                      field.onChange(topics);
                    } else {
                      field.onChange([]);
                    }
                  };

                  return (
                    <FormItem>
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Checkbox
                            className="ml-4"
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            ref={el => {
                              if (el && 'indeterminate' in el) {
                                (el as HTMLInputElement).indeterminate = isIndeterminate;
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-semibold">
                          Seleziona tutti
                        </FormLabel>
                      </FormItem>
                      {topics &&
                        topics.map((topic, index) => (
                          <FormField
                            key={index}
                            name="topics"
                            control={form.control}
                            render={({ field }) => {
                              return (
                                <FormItem key={index} className="flex flex-row items-center gap-2">
                                  <FormControl>
                                    <Checkbox
                                      className="ml-4"
                                      checked={field.value?.includes(topic)}
                                      onCheckedChange={(checked: boolean) => {
                                        return checked
                                          ? field.onChange([...field.value, topic])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== topic
                                            )
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {topic}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <hr className="my-4" />
              <div className="flex justify-between items-center">
                <Button type="submit">
                  <IconPlayerPlayFilled />
                  Inizia il quiz
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <IconX />
                  Chiudi
                </Button>
              </div>
            </form>
          </Form>
        </>
      )
      }
      {openQuiz && (
        <Quiz
          questions={questions.filter(q => selectedTopics.includes(q.title))}
          quizQuestions={questions.filter(q => selectedTopics.includes(q.title)).length}
          handleReset={handleReset}
          setLocked={setLocked}
        />
      )
      }
    </div >
  );
}