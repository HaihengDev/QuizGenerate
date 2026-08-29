import { useMemo } from 'react';

import { getAllQuizFiles } from '../utils/quizStorage';
import QuizFileCard from './QuizFileCard';
import './style/quiz-file.css';

export default function QuizFileCardLayout() {
  const quizFiles = useMemo(() => getAllQuizFiles(), []);

  return (
    <section id='quiz-file-card-list'>
      {quizFiles.map((quizFile) => (
        <QuizFileCard
          key={quizFile.id}
          id={quizFile.id}
          title={quizFile.title}
          createdAt={quizFile.createdAt}
          questionLength={quizFile.questionLength}
        />
      ))}
    </section>
  );
}
