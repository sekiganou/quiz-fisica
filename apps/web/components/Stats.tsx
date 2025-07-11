import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { GreenTick } from "./icons/GreenTick";
import { RedCross } from "./icons/RedCross";
import { statsStorage } from "@/app/actions/stats";
import { useEffect, useState } from "react";
import { Question } from "@/app/actions/questions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export default function Stats() {
  const [stats] = useState(statsStorage.get());
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [mappedStats, setMappedStats] = useState<{ title: string; totalCorrectAnswers: number; totalAnswers: number }[]>([]);

  const cards = {
    totalAnswers: {
      header: "Risposte totali",
      content: totalAnswers,
      icon: null,
      color: "text-blue-600"
    },
    totalCorrectAnswers: {
      header: "Risposte corrette",
      content: totalCorrectAnswers,
      icon: <GreenTick />,
      color: "text-green-600"
    },
    totalWrongAnswers: {
      header: "Risposte errate",
      content: totalAnswers - totalCorrectAnswers,
      icon: <RedCross />,
      color: "text-red-600"
    },
    successRate: {
      header: "Percentuale successo",
      content: totalAnswers > 0 ? (totalCorrectAnswers / totalAnswers * 100).toFixed(2) + ' %' : '0 %',
      icon: null,
      color: "text-blue-600"
    }
  }

  useEffect(() => {
    setTotalAnswers(stats.reduce((sum, stat) => sum + stat.totalAnswers, 0));
    setTotalCorrectAnswers(stats.reduce((sum, stat) => sum + stat.totalCorrectAnswers, 0));

    async function fetchQuestions() {
      const res = await fetch("/api/questions");
      const questions = await res.json() as Question[];

      setMappedStats(questions.map(question => ({
        title: question.title,
        totalCorrectAnswers: stats
          .reduce((sum, stat) =>
            sum + stat.arguments
              .filter(arg => arg.title === question.title)
              .reduce((acc, arg) => acc + arg.totalCorrectAnswers, 0), 0),
        totalAnswers: stats
          .reduce((sum, stat) =>
            sum + stat.arguments
              .filter(arg => arg.title === question.title)
              .reduce((acc, arg) => acc + arg.totalAnswers, 0), 0)
      })));
    }

    fetchQuestions();

  }, [stats]);

  return (
    <>
      <h2 className="text-xl font-semibold">Statistiche Quiz</h2>
      <div className="my-8 flex flex-col sm:flex-row gap-4">
        {cards && Object.entries(cards).map(([key, card]) => (
          // <AspectRatio ratio={ratio} className="mt-4" key={key}>
          <Card key={key} className="flex-1">
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
          // </AspectRatio>
        ))}
      </div>

      <Table>
        <TableCaption>
          Statistiche per ogni tipologia di domanda
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Titolo</TableHead>
            <TableHead>Risposte totali</TableHead>
            <TableHead>Risposte corrette</TableHead>
            <TableHead>Risposte errate</TableHead>
            <TableHead>Percentuale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappedStats && mappedStats.map((stat, index) =>
            <TableRow key={index}>
              <TableCell className="font-medium whitespace-pre-line break-words max-w-xs">
                {stat.title}
              </TableCell>
              <TableCell>
                {stat.totalAnswers}
              </TableCell>
              <TableCell>
                {stat.totalCorrectAnswers}
              </TableCell>
              <TableCell>
                {stat.totalAnswers - stat.totalCorrectAnswers}
              </TableCell>
              <TableCell>
                {stat.totalAnswers > 0 ? (stat.totalCorrectAnswers / stat.totalAnswers * 100).toFixed(2) : 0} %
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}