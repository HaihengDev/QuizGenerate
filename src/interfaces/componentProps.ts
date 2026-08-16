export interface QuizChoice {
  id: string;
  text: string;
}

export interface QuizCardProps {
  id: number;
  question: string;
  choices: QuizChoice[];
  answers: String[] | String;
}
