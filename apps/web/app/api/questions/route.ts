// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { getQuestions } from "../../actions/questions";

export async function GET() {
  const questions = await getQuestions();
  return NextResponse.json(questions);
}
