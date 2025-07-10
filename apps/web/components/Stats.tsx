import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { GreenTick } from "./icons/GreenTick";
import { RedCross } from "./icons/RedCross";
import { BarChart, ChartArea } from "lucide-react";
import { ChartContainer } from "@workspace/ui/components/chart";

export default function Stats() {
  return (
    <>
      <h2 className="text-xl font-semibold">Statistiche Quiz</h2>
      <div className="mt-2 flex flex-col sm:flex-row gap-4">
        <AspectRatio ratio={16 / 9} className="mt-4">
          <Card>
            <div className="flex items-center h-full font-semibold">
              <div>
                <CardHeader>Domande totali</CardHeader>
                <CardContent>
                  <div className="text-blue-600 flex items-center gap-2">
                    0
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={16 / 9} className="mt-4">
          <Card>
            <div className="flex items-center h-full font-semibold">
              <div>
                <CardHeader>Risposte corrette</CardHeader>
                <CardContent>
                  <div className="text-green-600 flex items-center gap-2">
                    <GreenTick />
                    0
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={16 / 9} className="mt-4">
          <Card>
            <div className="flex items-center h-full font-semibold">
              <div>
                <CardHeader>Risposte sbagliate</CardHeader>
                <CardContent>
                  <div className="text-red-600 flex items-center gap-2">
                    <RedCross />
                    0
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={16 / 9} className="mt-4">
          <Card>
            <div className="flex items-center h-full font-semibold">
              <div>
                <CardHeader>Percentuale successo</CardHeader>
                <CardContent>
                  <div className="text-blue-600 flex items-center gap-2">
                    0 %
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </AspectRatio>
      </div>
      {/* <ChartContainer>
        <BarChart data={data}>
          <Bar dataKey="value" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer> */}
    </>
  )
}