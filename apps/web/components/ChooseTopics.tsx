"use client";

import { Question } from "@/app/actions/questions";
import { useEffect, useState } from "react";
import Quiz from "./Quiz";
import { Button } from "@workspace/ui/components/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { IconCheck, IconPlayerPlayFilled, IconX } from "@tabler/icons-react";
import { statsByTopicStorage } from "@/app/actions/stats";

export const ChooseTopics = ({
  questions,
  handleReset,
}: {
  questions: Question[];
  handleReset: () => void;
}) => {
  const [stats, setStats] = useState(statsByTopicStorage.array());
  const topics = questions.map((q) => q.topic);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openChooseTopics, setOpenChooseTopics] = useState(true);
  const [openQuiz, setOpenQuiz] = useState(false);

  const FormSchema = z.object({
    topics: z
      .array(z.string())
      .refine((value) => value.some((topic) => topic), {
        message: "Seleziona almeno un argomento.",
      }),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSelectedTopics(data.topics);
    setOpenChooseTopics(false);
    setOpenQuiz(true);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topics: topics,
    },
  });

  useEffect(() => {
    questions.forEach((question) => {
      if (!statsByTopicStorage.has(question.topic)) {
        const stat = {
          topic: question.topic,
          totalCorrectAnswers: 0,
          totalAnswers: 0,
        };
        statsByTopicStorage.add(stat);
        setStats((prev) => [...prev, stat]);
      }
    });
  }, [questions]);

  return (
    <div>
      {openChooseTopics && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Scegli gli argomenti del quiz
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => {
                  const allSelected = topics.every((topic) =>
                    field.value?.includes(topic)
                  );
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
                            ref={(el) => {
                              if (el && "indeterminate" in el) {
                                (el as HTMLInputElement).indeterminate =
                                  isIndeterminate;
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-semibold">
                          Seleziona tutti
                        </FormLabel>
                      </FormItem>
                      {stats &&
                        stats.map((stat, index) => (
                          <FormField
                            key={index}
                            name="topics"
                            control={form.control}
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={index}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className="ml-4"
                                      checked={field.value?.includes(
                                        stat.topic
                                      )}
                                      onCheckedChange={(checked: boolean) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              stat.topic,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== stat.topic
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal flex items-center gap-2 w-full mr-2">
                                    <span className="flex-1">{stat.topic}</span>
                                    <span className="w-4 flex justify-center text-gray-500">
                                      <IconCheck size={16} />
                                    </span>
                                    <span className="w-4 flex justify-center text-gray-500">
                                      {stat.totalAnswers > 0
                                        ? stat.totalCorrectAnswers
                                        : "-"}
                                    </span>
                                    <span className="w-4 flex justify-center text-gray-500">
                                      <IconX size={16} />
                                    </span>
                                    <span className="w-4 flex justify-center text-gray-500">
                                      {stat.totalAnswers > 0
                                        ? stat.totalAnswers -
                                          stat.totalCorrectAnswers
                                        : "-"}
                                    </span>
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <Button type="submit" className="w-full sm:w-auto">
                  <IconPlayerPlayFilled />
                  Inizia il quiz
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full sm:w-auto"
                >
                  <IconX />
                  Chiudi
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {openQuiz && (
        <Quiz
          questions={questions.filter((q) => selectedTopics.includes(q.topic))}
          handleReset={handleReset}
        />
      )}
    </div>
  );
};
