import { useState } from 'react';
import questions from '../data/quiz.json';
import QuizCard from './QuizCard';
import './style/quiz-card.css';

export default function QuizCardLayout() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});

  const [required, setRequired] = useState(false);

  const currentQuestion = questions[currentIndex];

  const selectedAnswers = userAnswers[currentQuestion.id] ?? [];

  const handleAnswerChange = (answers: string[]) => {
    setUserAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answers,
    }));

    // Remove validation error once user selects an answer
    if (answers.length > 0) {
      setRequired(false);
    }
  };

  const handleNext = () => {
    // Validate answer
    if (selectedAnswers.length === 0) {
      setRequired(true);
      return;
    }

    setRequired(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
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
