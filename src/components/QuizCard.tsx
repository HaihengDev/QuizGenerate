import type { QuizCardProps } from '../interfaces/componentProps';
import './style/quiz-card.css';

interface QuizCardPropsExtended extends QuizCardProps {
  selectedAnswers: string[];
  onAnswerChange: (answers: string[]) => void;
}

export default function QuizCard({
  id,
  question,
  choices,
  answers,
  selectedAnswers,
  onAnswerChange,
}: QuizCardPropsExtended) {
  const isMultiple = answers.length > 1;

  const handleChange = (choiceId: string) => {
    if (isMultiple) {
      const newAnswers = selectedAnswers.includes(choiceId)
        ? selectedAnswers.filter((answer) => answer !== choiceId)
        : [...selectedAnswers, choiceId];

      onAnswerChange(newAnswers);
    } else {
      onAnswerChange([choiceId]);
    }
  };

  return (
    <form className="quiz-card">
      <h3 className="quiz-question">
        {id}) {question}
      </h3>

      <section className="choice-container">
        {choices.map((choice) => (
          <label className="choice" key={choice.id}>
            <input
              type={isMultiple ? 'checkbox' : 'radio'}
              name={`question-${id}`}
              value={choice.id}
              checked={selectedAnswers.includes(choice.id)}
              onChange={() => handleChange(choice.id)}
            />

            <span className="choice-label">{choice.id}</span>

            <span>{choice.text}</span>
          </label>
        ))}
      </section>
    </form>
  );
}
