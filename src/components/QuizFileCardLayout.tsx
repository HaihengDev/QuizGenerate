import { useMemo, useState } from 'react';

import { deleteUserQuizFile, getAllQuizFiles, getUserQuizFiles } from '../utils/quizStorage';
import QuizFileCard from './QuizFileCard';
import './style/quiz-file.css';

export default function QuizFileCardLayout() {
  const [quizFiles, setQuizFiles] = useState(() => getAllQuizFiles());
  const userFileIds = useMemo(() => new Set(getUserQuizFiles().map((file) => file.id)), [quizFiles]);

  const handleDelete = (id: number) => {
    const target = quizFiles.find((file) => file.id === id);
    if (!target || !userFileIds.has(id)) return;
    if (!window.confirm(`Delete “${target.title}” and its saved questions? This cannot be undone.`)) return;
    if (deleteUserQuizFile(id)) setQuizFiles(getAllQuizFiles());
  };

  return (
    <section id='quiz-file-card-list'>
      {quizFiles.map((quizFile) => (
        <QuizFileCard
          key={quizFile.id}
          id={quizFile.id}
          title={quizFile.title}
          createdAt={quizFile.createdAt}
          questionLength={quizFile.questionLength}
          canDelete={userFileIds.has(quizFile.id)}
          onDelete={handleDelete}
        />
      ))}
    </section>
  );
}
