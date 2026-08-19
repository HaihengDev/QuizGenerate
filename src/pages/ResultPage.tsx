import { useLocation, Link } from 'react-router-dom';
import './style/result-page.css';

interface QuizResultState {
  quizId: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  answeredCount: number;
  createdAt: string;
}

const RESULT_STORAGE_KEY = 'quiz_last_result';

const Page = () => {
  const location = useLocation();
  const state = location.state as QuizResultState | null;

  const storedResult =
    typeof window !== 'undefined'
      ? (JSON.parse(
          localStorage.getItem(RESULT_STORAGE_KEY) || 'null',
        ) as QuizResultState | null)
      : null;

  const result = state ?? storedResult;

  if (!result) {
    return (
      <section className="result-page">
        <div className="result-card">
          <p className="result-label">No result found</p>
          <h1>Your quiz result is not available yet.</h1>
          <p className="result-description">
            Complete a quiz first and we’ll show your score here.
          </p>

          <Link className="result-button" to="/">
            Back to quizzes
          </Link>
        </div>
      </section>
    );
  }

  const accuracy =
    result.totalQuestions > 0
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;

  return (
    <section className="result-page">
      <div className="result-card">
        <p className="result-label">Quiz complete</p>
        <h1>
          You got {result.correctCount} out of {result.totalQuestions} questions
          correct.
        </h1>
        <p className="result-description">
          {result.incorrectCount} question
          {result.incorrectCount === 1 ? '' : 's'} missed, with an accuracy of{' '}
          {accuracy}%.
        </p>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-value">{result.correctCount}</span>
            <span className="result-stat-label">Correct</span>
          </div>

          <div className="result-stat">
            <span className="result-stat-value">{result.incorrectCount}</span>
            <span className="result-stat-label">Incorrect</span>
          </div>

          <div className="result-stat">
            <span className="result-stat-value">{result.answeredCount}</span>
            <span className="result-stat-label">Answered</span>
          </div>
        </div>

        <div className="result-actions">
          <Link className="result-button secondary" to="/quiz-file">
            Try another quiz
          </Link>

          <Link className="result-button" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
