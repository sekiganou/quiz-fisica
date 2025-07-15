"use server";

import { readFileSync } from "fs";
import path from "path";

export interface UserAnswer {
  questionId: number;
  answerText: string;
  isCorrect: boolean;
}

interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  topic: string;
  image: string | null;
  content: string;
  followUpQuestion: Question | null;
  answers: Answer[];
}

const QUESTION_LETTER = "Q";
const FOLLOWUPQUESTION_LETTER = "U";
const TRUEANSWER_LETTER = "T";
const FALSEANSWER_LETTER = "F";
const IMAGE_LETTER = "I";
const TOPIC_LETTER = "N";
const IMAGE_PATH_PREFIX = "/images/";

export async function getQuestions() {
  const fullPath = path.join(process.cwd(), "public", "questions.txt");
  return await loadQuestionsFromFile(fullPath);
}

async function loadQuestionsFromFile(fullPath: string): Promise<Question[]> {
  let questionId = 0;
  let fileContent = readFileSync(fullPath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
  let questions: Question[] = [];
  let currentQuestion: Question | null = null;
  lines.forEach((line) => {
    if (
      !line.startsWith(QUESTION_LETTER) &&
      !line.startsWith(FOLLOWUPQUESTION_LETTER) &&
      !line.startsWith(TRUEANSWER_LETTER) &&
      !line.startsWith(FALSEANSWER_LETTER) &&
      !line.startsWith(IMAGE_LETTER) &&
      !line.startsWith(TOPIC_LETTER)
    ) {
      throw new Error(`Invalid line format: ${line}`);
    }
    let currentText = line.slice(2).trim();
    let currentLetter = line.split(":")[0];
    switch (currentLetter) {
      case QUESTION_LETTER: {
        currentQuestion = {
          id: questionId++,
          topic: "",
          image: null,
          content: currentText,
          followUpQuestion: null,
          answers: [],
        };
        questions.push(currentQuestion);
        break;
      }
      case FOLLOWUPQUESTION_LETTER: {
        if (!currentQuestion) {
          throw new Error("Follow-up question without a main question");
        }
        const followUpQuestion: Question = {
          id: questionId++,
          topic: currentQuestion.topic,
          content: currentText,
          image: null,
          followUpQuestion: null,
          answers: [],
        };
        currentQuestion.followUpQuestion = followUpQuestion;
        currentQuestion = followUpQuestion;
        break;
      }
      case TRUEANSWER_LETTER: {
        if (!currentQuestion) {
          throw new Error("True answer without a main question");
        }
        currentQuestion.answers.push({
          id: currentQuestion.answers.length + 1,
          answerText: currentText,
          isCorrect: true,
        });
        break;
      }
      case FALSEANSWER_LETTER: {
        if (!currentQuestion) {
          throw new Error("False answer without a main question");
        }
        currentQuestion.answers.push({
          id: currentQuestion.answers.length + 1,
          answerText: currentText,
          isCorrect: false,
        });
        break;
      }
      case IMAGE_LETTER: {
        if (!currentQuestion) {
          throw new Error("Image without a main question");
        }
        const imagePath = IMAGE_PATH_PREFIX + currentText;
        currentQuestion.image = imagePath;
        break;
      }
      case TOPIC_LETTER: {
        if (!currentQuestion) {
          throw new Error("Title without a main question");
        }
        currentQuestion.topic = currentText;
        break;
      }
      default:
        break;
    }
  });
  return questions;
}
