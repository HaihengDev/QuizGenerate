import quizSeedData from '../data/quizFile.json';

import type {
  QuizFileRecord,
  QuizQuestion,
} from '../interfaces/componentProps';

type LegacyQuizChoice = {
  id: string;
  text: string;
};

type LegacyQuizQuestion = {
  id: number;
  question: string;
  choices: LegacyQuizChoice[];
  answer: string | string[];
};

const normalizeLegacyQuestion = (
  question: LegacyQuizQuestion,
  index: number,
): QuizQuestion => {
  const correctAnswers = Array.isArray(question.answer)
    ? question.answer
    : [question.answer];

  return {
    id: question.id ?? index + 1,
    question: question.question,
    answers: question.choices.map((choice, answerIndex) => ({
      id: answerIndex + 1,
      text: choice.text,
      isCorrect: correctAnswers.includes(choice.id),
    })),
  };
};

const normalizeQuizFile = (file: any): QuizFileRecord => {
  const normalizedQuiz = Array.isArray(file?.quiz)
    ? file.quiz.map((question: any, index: number) => {
        if (question && Array.isArray(question.answers)) {
          return {
            id: question.id ?? index + 1,
            question: question.question,
            answers: question.answers.map(
              (answer: any, answerIndex: number) => ({
                id: answer.id ?? answerIndex + 1,
                text: answer.text,
                isCorrect: Boolean(answer.isCorrect),
              }),
            ),
          };
        }

        return normalizeLegacyQuestion(question as LegacyQuizQuestion, index);
      })
    : [];

  return {
    id: Number(file.id),
    title: String(file.title),
    createdAt: String(file.createdAt),
    quiz: normalizedQuiz,
    questionLength: normalizedQuiz.length,
  };
};

export const QUIZ_FILE_STORAGE_KEY = 'quizify-user-files';

export const getUserQuizFiles = (): QuizFileRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = window.localStorage.getItem(QUIZ_FILE_STORAGE_KEY);

    if (!value) {
      return [];
    }

    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue)
      ? parsedValue.map((file) => normalizeQuizFile(file))
      : [];
  } catch {
    return [];
  }
};

export const saveUserQuizFiles = (files: QuizFileRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(QUIZ_FILE_STORAGE_KEY, JSON.stringify(files));
};

export const getQuizFileById = (fileId: number): QuizFileRecord | null => {
  return getAllQuizFiles().find((file) => file.id === fileId) ?? null;
};

export const getAllQuizFiles = (): QuizFileRecord[] => [
  ...quizSeedData.map((file: any) => normalizeQuizFile(file)),
  ...getUserQuizFiles(),
];

export const createQuizFile = (title: string): QuizFileRecord => {
  const trimmedTitle = title.trim();

  const newFile: QuizFileRecord = {
    id: Date.now(),
    title: trimmedTitle,
    createdAt: new Date().toISOString(),
    quiz: [],
    questionLength: 0,
  };

  const nextFiles = [...getUserQuizFiles(), newFile];

  saveUserQuizFiles(nextFiles);

  return newFile;
};

export const updateQuizFile = (
  fileId: number,
  nextQuestions: QuizQuestion[],
) => {
  const userFiles = getUserQuizFiles();

  const fileIndex = userFiles.findIndex((file) => file.id === fileId);

  if (fileIndex === -1) {
    return null;
  }

  const nextFile: QuizFileRecord = {
    ...userFiles[fileIndex],
    quiz: nextQuestions,
    questionLength: nextQuestions.length,
    createdAt: userFiles[fileIndex].createdAt,
  };

  const nextFiles = userFiles.map((file) =>
    file.id === fileId ? nextFile : file,
  );

  saveUserQuizFiles(nextFiles);

  return nextFile;
};

export const deleteUserQuizFile = (fileId: number): boolean => {
  const userFiles = getUserQuizFiles();
  const nextFiles = userFiles.filter((file) => file.id !== fileId);
  if (nextFiles.length === userFiles.length) return false;
  saveUserQuizFiles(nextFiles);
  return true;
};
