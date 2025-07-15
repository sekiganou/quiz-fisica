import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { statsByTopicStorage } from "@/app/actions/stats";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Question } from "@/app/actions/questions";

export default function Stats({
  handleClose,
  questions,
}: {
  handleClose: () => void;
  questions: Question[];
}) {
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  const cards = [
    {
      header: "Risposte totali",
      content: totalAnswers > 0 ? totalAnswers : "-",
      icon: null,
      color: "text-blue-600",
    },
    {
      header: "Risposte corrette",
      content: totalAnswers > 0 ? totalCorrectAnswers : "-",
      icon: <IconCheck />,
      color: "text-green-600",
    },
    {
      header: "Risposte errate",
      content: totalAnswers > 0 ? totalAnswers - totalCorrectAnswers : "-",
      icon: <IconX />,
      color: "text-red-600",
    },
    {
      header: "Percentuale successo",
      content:
        totalAnswers > 0
          ? ((totalCorrectAnswers / totalAnswers) * 100).toFixed(2) + " %"
          : "- %",
      icon: null,
      color: "text-blue-600",
    },
  ];

  useEffect(() => {
    questions.forEach((question) => {
      if (!statsByTopicStorage.has(question.topic)) {
        statsByTopicStorage.add({
          topic: question.topic,
          totalCorrectAnswers: 0,
          totalAnswers: 0,
        });
      }
    });

    setTotalAnswers(
      statsByTopicStorage
        .array()
        .reduce((sum, stat) => sum + stat.totalAnswers, 0)
    );
    setTotalCorrectAnswers(
      statsByTopicStorage
        .array()
        .reduce((sum, stat) => sum + stat.totalCorrectAnswers, 0)
    );
  }, [questions]);

  return (
    <>
      <h2 className="text-xl font-semibold">Statistiche Quiz</h2>
      <div className="my-8 flex flex-col sm:flex-row gap-4">
        {cards &&
          cards.map((card, index) => (
            <Card key={index} className="flex-1">
              <div className="flex items-center h-full font-semibold">
                <div>
                  <CardHeader>{card.header}</CardHeader>
                  <CardContent>
                    <div className={`${card.color} flex items-center gap-2`}>
                      {card.icon}
                      {card.content}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Table>
        <TableCaption>Statistiche per ogni tipologia di domanda</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Titolo</TableHead>
            <TableHead>R. totali</TableHead>
            <TableHead>R. corrette</TableHead>
            <TableHead>R. errate</TableHead>
            <TableHead>P. successo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsByTopicStorage &&
            statsByTopicStorage.array().map((stat, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium whitespace-pre-line break-words max-w-xs">
                  {stat.topic}
                </TableCell>
                <TableCell>
                  {stat.totalAnswers > 0 ? stat.totalAnswers : "-"}
                </TableCell>
                <TableCell>
                  {stat.totalAnswers > 0 ? stat.totalCorrectAnswers : "-"}
                </TableCell>
                <TableCell>
                  {stat.totalAnswers > 0
                    ? stat.totalAnswers - stat.totalCorrectAnswers
                    : "-"}
                </TableCell>
                <TableCell>
                  {stat.totalAnswers > 0
                    ? (
                        (stat.totalCorrectAnswers / stat.totalAnswers) *
                        100
                      ).toFixed(2) + " %"
                    : "- %"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="my-4 flex justify-center">
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
