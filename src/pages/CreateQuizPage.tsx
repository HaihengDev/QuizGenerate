import { useState } from 'react';

import CreateQuizQuestion from '../components/CreateQuizQuestion';
import CreatedQuestion from '../components/CreatedQuestion';

import type { QuizQuestion } from '../interfaces/componentProps';

import './style/create-quiz-page.css';

const CreateQuizPage = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null,
  );

  /* ========================================
     Open Create Form
  ======================================== */

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  /* ========================================
     Create / Update Question
  ======================================== */

  const handleSubmitQuestion = (question: QuizQuestion) => {
    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((item) =>
          item === editingQuestion
            ? {
                ...question,
              }
            : item,
        ),
      );
    } else {
      setQuestions((prev) => [...prev, question]);
    }

    handleCloseQuestionForm();
  };

  /* ========================================
     Edit Question
  ======================================== */

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  /* ========================================
     Delete Question
  ======================================== */

  const handleDeleteQuestion = (question: QuizQuestion) => {
    setQuestions((prev) => prev.filter((item) => item !== question));
  };

  /* ========================================
     Close Form
  ======================================== */

  const handleCloseQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  /* ========================================
     Close When Clicking Backdrop
  ======================================== */

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseQuestionForm();
    }
  };

  return (
    <main className="create-quiz-page">
      {/* ========================================
          Page Header
      ======================================== */}

      <header className="create-quiz-page-header">
        <div className="create-quiz-page-title">
          <span className="create-quiz-label">Quiz</span>

          <h1>Create Quiz</h1>

          <p>Create questions and select one or more correct answers.</p>
        </div>

        <button
          type="button"
          className="add-question-btn"
          onClick={handleAddQuestion}
        >
          <span>+</span>
          Add Question
        </button>
      </header>

      {/* ========================================
          Created Questions
      ======================================== */}

      <CreatedQuestion
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />

      {/* ========================================
          Question Modal
      ======================================== */}

      {showQuestionForm && (
        <div
          className="question-modal-overlay"
          onMouseDown={handleOverlayClick}
        >
          <div
            className="question-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CreateQuizQuestion
              onSubmit={handleSubmitQuestion}
              initialQuestion={editingQuestion}
              onCancel={handleCloseQuestionForm}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default CreateQuizPage;
