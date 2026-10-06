import { useNavigate } from 'react-router-dom';
import type { QuizFileCardProps } from '../interfaces/componentProps';
import { dateFormatHelper } from '../utils/helper';
import './style/quiz-file.css';

export default function QuizFileCard({
  id,
  title,
  createdAt,
  questionLength,
  canDelete = false,
  onDelete,
}: QuizFileCardProps) {
  const navigate = useNavigate();

  return (
    <figure
      className="quiz-file-container"
      onClick={() => navigate(`/quiz-form/${id}`)}
    >
      <h3>{title}</h3>
      <p>created at: {dateFormatHelper(createdAt)}</p>
      <p>Questions: {questionLength}</p>
      {canDelete && (
        <button
          type="button"
          className="quiz-file-delete"
          aria-label={`Delete ${title}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.(id);
          }}
        >
          Delete
        </button>
      )}
    </figure>
  );
}
