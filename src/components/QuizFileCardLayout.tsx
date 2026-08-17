import QuizFiles from '../data/quizFile.json';
import QuizFileCard from './QuizFileCard';
import './style/quiz-file.css';

export default function QuizFileCardLayout() {
  return (
    <section id="quiz-file-card-list">
      {QuizFiles.map((quizFile) => (
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
