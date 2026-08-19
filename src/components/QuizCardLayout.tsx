import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import quizFiles from '../data/quizFile.json';
import QuizCard from './QuizCard';
import './style/quiz-card.css';

const RESULT_STORAGE_KEY = 'quiz_last_result';

const normalizeAnswer = (answer: string | string[]) => [...answer].sort().join('|');

export default function QuizCardLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questions = quizFiles.find(
    (quizFile) => quizFile.id === Number(id),
  )?.quiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
  const [required, setRequired] = useState(false);

  // Handle invalid quiz ID
  if (!questions || questions.length === 0) {
    return (
      <section id="quiz-card-layout">
        <p>Quiz not found.</p>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];

  const selectedAnswers = userAnswers[currentQuestion.id] ?? [];

  const handleAnswerChange = (answers: string[]) => {
    setUserAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answers,
    }));

    if (answers.length > 0) {
      setRequired(false);
    }
  };

  const handleNext = () => {
    if (selectedAnswers.length === 0) {
      setRequired(true);
      return;
    }

    setRequired(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      const totalQuestions = questions.length;
      const correctCount = questions.reduce((count, question) => {
        const correctAnswers = Array.isArray(question.answer)
          ? question.answer
          : [question.answer];
        const userAnswer = userAnswers[question.id] ?? [];

        return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswers)
          ? count + 1
          : count;
      }, 0);

      const result = {
        quizId: Number(id),
        totalQuestions,
        correctCount,
        incorrectCount: totalQuestions - correctCount,
        answeredCount: Object.keys(userAnswers).length,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      navigate('/result', { state: result });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
      setRequired(false);
    }
  };

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <section id="quiz-card-layout">
      <QuizCard
        id={currentQuestion.id}
        question={currentQuestion.question}
        choices={currentQuestion.choices}
        answers={
          Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer
            : [currentQuestion.answer]
        }
        selectedAnswers={selectedAnswers}
        onAnswerChange={handleAnswerChange}
      />

      {required && (
        <p className="required-message">
          Please select at least one answer before continuing.
        </p>
      )}

      <div className="btn-wrapper">
        <button type="button" onClick={handleBack} disabled={isFirstQuestion}>
          Back
        </button>

        <button type="button" onClick={handleNext}>
          {isLastQuestion ? 'Submit' : 'Next'}
        </button>
      </div>
    </section>
  );
}
