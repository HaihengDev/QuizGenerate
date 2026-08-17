import { useNavigate } from 'react-router-dom';
import type { QuizFileCardProps } from '../interfaces/componentProps';
import { dateFormatHelper } from '../utils/helper';
import './style/quiz-file.css';

export default function QuizFileCard({
  id,
  title,
  createdAt,
  questionLength,
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
    </figure>
  );
}
