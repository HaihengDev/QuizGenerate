import type { QuizQuestion } from '../interfaces/componentProps';

import './style/quiz-question-card.css';

interface CreatedQuestionProps {
  questions: QuizQuestion[];

  onEdit?: (question: QuizQuestion) => void;

  onDelete?: (question: QuizQuestion) => void;
}

export default function CreatedQuestion({
  questions,
  onEdit,
  onDelete,
}: CreatedQuestionProps) {
  /* ========================================
     Empty State
  ======================================== */

  if (questions.length === 0) {
    return (
      <section className="created-question-list">
        <div className="created-question-empty">
          <div className="created-question-empty-icon">?</div>

          <h3>No questions created yet</h3>

          <p>Click "Add Question" to create your first question.</p>
        </div>
      </section>
    );
  }

  /* ========================================
     Question List
  ======================================== */

  return (
    <section className="created-question-list">
      {/* Header */}

      <header className="created-question-list-header">
        <div>
          <span className="created-question-label">Quiz</span>

          <h2>Created Questions</h2>

          <p>
            {questions.length} question
            {questions.length !== 1 ? 's' : ''} created
          </p>
        </div>
      </header>

      {/* Questions */}

      <div className="created-question-items">
        {questions.map((question, index) => {
          const correctAnswers = question.answers.filter(
            (answer) => answer.isCorrect,
          );

          return (
            <article className="quiz-question-card" key={question.id ?? index}>
              {/* ========================================
                  Header
              ======================================== */}

              <header className="quiz-question-card-header">
                <div className="quiz-question-card-title">
                  <span className="quiz-question-number">
                    Question {index + 1}
                  </span>

                  <h3>{question.question}</h3>
                </div>

                <div className="quiz-question-actions">
                  {onEdit && (
                    <button
                      type="button"
                      className="question-edit-btn"
                      onClick={() => onEdit(question)}
                    >
                      Edit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      className="question-delete-btn"
                      onClick={() => onDelete(question)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </header>

              {/* ========================================
                  Answers
              ======================================== */}

              <div className="quiz-question-answers">
                {question.answers.map((answer, answerIndex) => {
                  const answerLetter = String.fromCharCode(65 + answerIndex);

                  return (
                    <div
                      key={answer.id}
                      className={`quiz-question-answer ${
                        answer.isCorrect ? 'quiz-question-answer-correct' : ''
                      }`}
                    >
                      <span className="quiz-answer-letter">{answerLetter}</span>

                      <span className="quiz-answer-text">{answer.text}</span>

                      {answer.isCorrect && (
                        <span className="quiz-answer-key">Correct</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ========================================
                  Footer
              ======================================== */}

              <footer className="quiz-question-card-footer">
                <span>
                  {correctAnswers.length} correct answer
                  {correctAnswers.length !== 1 ? 's' : ''}
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
