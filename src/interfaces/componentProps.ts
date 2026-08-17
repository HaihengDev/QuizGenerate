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

export interface FileDropZoneProps {
  accept?: string;
  maxSize?: number;
  onFileSelect?: (file: File | null) => void;
}

export interface QuizFileCardProps {
  id: number;
  title: string;
  createdAt: String;
  questionLength: number;
}
