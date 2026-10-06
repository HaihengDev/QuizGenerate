import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllQuizFiles } from '../utils/quizStorage';
import './style/question-cards.css';

export default function QuestionCardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const files = useMemo(() => getAllQuizFiles(), []);
  const selectedFileId = Number(searchParams.get('file')) || 0;
  const selectedFile = files.find((file) => file.id === selectedFileId);
  const order = searchParams.get('order') === 'random' ? 'random' : 'ordered';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);
  const cards = useMemo(() => {
    const questions = [...(selectedFile?.quiz ?? [])];
    if (order === 'random') {
      for (let index = questions.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
      }
    }
    return questions;
  }, [selectedFile, order]);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswerShown(false);
  }, [selectedFileId, order]);

  const selectFile = (fileId: number) => {
    const next = new URLSearchParams(searchParams);
    if (fileId) next.set('file', String(fileId));
    else next.delete('file');
    setSearchParams(next);
  };

  const moveCard = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    setAnswerShown(false);
  };

  return (
    <section className="question-cards-page">
      <header className="question-cards-header">
        <div>
          <p className="question-cards-eyebrow">Practice library</p>
          <h1>Question Cards</h1>
          <p>Choose a quiz file, then review its questions and reveal each answer.</p>
        </div>
        <label>
          Quiz file
          <select value={selectedFileId || ''} onChange={(event) => selectFile(Number(event.target.value))}>
            <option value="">Choose a quiz file</option>
            {files.map((file) => <option key={file.id} value={file.id}>{file.title}</option>)}
          </select>
        </label>
      </header>

      {selectedFile ? (
        cards.length ? (
          <div className="flashcard-deck">
            <div className="flashcard-deck-heading">
              <div>
                <h2>{selectedFile.title}</h2>
                <p>{order === 'random' ? 'Shuffled card order' : 'Document order'}</p>
              </div>
              <span className="flashcard-counter">Card {currentIndex + 1} of {cards.length}</span>
            </div>

            <article className={`flashcard ${answerShown ? 'answer-visible' : ''}`} aria-live="polite">
              <p className="flashcard-side-label">{answerShown ? 'Answer' : 'Question'}</p>
              {!answerShown ? (
                <h3>{cards[currentIndex].question}</h3>
              ) : (
                <div className="flashcard-answer-list">
                  {cards[currentIndex].answers.filter((answer) => answer.isCorrect).map((answer) => (
                    <p key={answer.id}>{answer.text}</p>
                  ))}
                </div>
              )}
              <button type="button" className="flashcard-reveal" onClick={() => setAnswerShown((shown) => !shown)}>
                {answerShown ? 'Show question' : 'Show answer'}
              </button>
            </article>

            <div className="flashcard-controls">
              <button type="button" onClick={() => moveCard(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>Previous</button>
              <button type="button" className="flashcard-next" onClick={() => moveCard(Math.min(cards.length - 1, currentIndex + 1))} disabled={currentIndex === cards.length - 1}>Next</button>
            </div>
            <button type="button" className="flashcard-all-decks" onClick={() => selectFile(0)}>Browse all quiz files</button>
          </div>
        ) : (
          <div className="question-cards-empty"><p>This quiz file has no question cards yet.</p></div>
        )
      ) : (
        <div className="question-deck-grid">
          {files.filter((file) => file.questionLength > 0).map((file) => (
            <article className="question-deck-card" key={file.id}>
              <div>
                <h2>{file.title}</h2>
                <p>{file.questionLength} question cards</p>
              </div>
              <button type="button" onClick={() => selectFile(file.id)}>Open cards</button>
            </article>
          ))}
          {!files.some((file) => file.questionLength > 0) && (
            <div className="question-cards-empty"><p>No question cards yet. Upload a PDF or create a quiz first.</p></div>
          )}
        </div>
      )}
    </section>
  );
}
