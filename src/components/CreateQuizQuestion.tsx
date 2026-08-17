import { useState } from 'react';
import type {
  QuizQuestion,
  QuizAnswer,
  CreateQuizQuestionProps,
} from '../interfaces/componentProps';
import './style/create-quiz-question.css';

const CreateQuizQuestion = ({ onSubmit }: CreateQuizQuestionProps) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const handleAddAnswer = () => {
    setAnswers((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: '',
        isCorrect: false,
      },
    ]);
  };

  const handleRemoveAnswer = (id: number) => {
    setAnswers((prev) => prev.filter((answer) => answer.id !== id));
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === id
          ? {
              ...answer,
              text: value,
            }
          : answer,
      ),
    );
  };

  const handleToggleCorrect = (id: number) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === id
          ? {
              ...answer,
              isCorrect: !answer.isCorrect,
            }
          : answer,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }

    if (answers.length < 2) {
      alert('Please add at least 2 answers.');
      return;
    }

    const hasEmptyAnswer = answers.some((answer) => !answer.text.trim());

    if (hasEmptyAnswer) {
      alert('Please fill in all answers.');
      return;
    }

    const hasCorrectAnswer = answers.some((answer) => answer.isCorrect);

    if (!hasCorrectAnswer) {
      alert('Please select at least one correct answer.');
      return;
    }

    const newQuestion: QuizQuestion = {
      question: question.trim(),
      answers,
    };

    onSubmit?.(newQuestion);
  };

  return (
    <form className="create-quiz-question" onSubmit={handleSubmit}>
      {/* Header */}

      <div className="question-header">
        <div>
          <span className="question-label">Question</span>

          <h2>Create Quiz Question</h2>
        </div>
      </div>

      {/* Question */}

      <div className="form-group">
        <label htmlFor="question">Question</label>

        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          rows={4}
          required
        />
      </div>

      {/* Answers */}

      <div className="answers-section">
        <div className="answers-header">
          <div>
            <h3>Answers</h3>

            <p>
              Click A, B, C, or D to mark the correct answer. You can select
              multiple answers.
            </p>
          </div>

          <button
            type="button"
            className="add-answer-btn"
            onClick={handleAddAnswer}
          >
            + Add Answer
          </button>
        </div>

        {/* Empty state */}

        {answers.length === 0 && (
          <div className="answers-empty">
            <span className="answers-empty-icon">+</span>

            <p>No answers added yet.</p>

            <span>Click "Add Answer" to create your first answer.</span>
          </div>
        )}

        {/* Answer list */}

        {answers.length > 0 && (
          <div className="answers-list">
            {answers.map((answer, index) => {
              const answerLetter = String.fromCharCode(65 + index);

              return (
                <div
                  className={`answer-item ${
                    answer.isCorrect ? 'answer-correct' : ''
                  }`}
                  key={answer.id}
                >
                  {/* Answer Key */}

                  <button
                    type="button"
                    className={`answer-number ${
                      answer.isCorrect ? 'answer-key' : ''
                    }`}
                    onClick={() => handleToggleCorrect(answer.id)}
                    title={
                      answer.isCorrect
                        ? 'Remove answer key'
                        : 'Set as answer key'
                    }
                    aria-label={
                      answer.isCorrect
                        ? `Remove ${answerLetter} as answer key`
                        : `Set ${answerLetter} as answer key`
                    }
                  >
                    {answerLetter}
                  </button>

                  {/* Answer */}

                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(answer.id, e.target.value)
                    }
                    placeholder={`Enter answer ${answerLetter}...`}
                    required
                  />

                  {/* Remove */}

                  <button
                    type="button"
                    className="remove-answer-btn"
                    onClick={() => handleRemoveAnswer(answer.id)}
                    title="Remove answer"
                    aria-label={`Remove answer ${answerLetter}`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="question-footer">
        <span className="correct-count">
          {answers.filter((answer) => answer.isCorrect).length} correct answer
          {answers.filter((answer) => answer.isCorrect).length !== 1 ? 's' : ''}
        </span>

        <button type="submit" className="create-question-btn">
          Create Question
        </button>
      </div>
    </form>
  );
};

export default CreateQuizQuestion;
