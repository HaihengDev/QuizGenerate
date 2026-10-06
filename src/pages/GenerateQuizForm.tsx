import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropZone from '../components/FileDropZone';
import { extractQuizFromPdf } from '../utils/pdfQuizImport';
import { getUserQuizFiles, saveUserQuizFiles } from '../utils/quizStorage';
import type { QuizQuestion } from '../interfaces/componentProps';
import './style/generate-quiz.css';

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [practiceOrder, setPracticeOrder] = useState<'ordered' | 'random'>(
    'ordered',
  );
  const navigate = useNavigate();

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    setError('');
    setQuestions([]);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const generated = await extractQuizFromPdf(file, setProgress);
      if (!generated.length) {
        throw new Error(
          'No practice questions could be generated. This PDF may be image-only or may not contain readable question choices or term definitions.',
        );
      }
      setQuestions(generated);
      setProgress(
        `Prepared ${generated.length} practice questions. Review them before starting.`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not read this PDF.',
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () => {
    if (!file || !questions.length) return;
    const id = Date.now();
    const quiz = {
      id,
      title: file.name.replace(/\.pdf$/i, ''),
      createdAt: new Date().toISOString(),
      quiz: questions,
      questionLength: questions.length,
    };
    saveUserQuizFiles([...getUserQuizFiles(), quiz]);
    navigate(`/question-cards?file=${id}&order=${practiceOrder}`);
  };

  return (
    <section id='generate-quiz-form-container'>
      <header className='generate-quiz-header'>
        <h1>Generate Quiz</h1>

        <p>
          Upload a PDF document and turn its content into an interactive quiz.
        </p>
      </header>

      <div className='generate-quiz-card'>
        <h2 className='generate-quiz-section-title'>Upload your PDF</h2>

        <p className='generate-quiz-section-description'>
          Select a PDF file containing the material you want to use for your
          quiz.
        </p>

        <div className='generate-quiz-upload'>
          <FileDropZone
            accept='.pdf,application/pdf'
            maxSize={1000}
            onFileSelect={handleFileSelect}
          />
        </div>

        <div className='generate-quiz-footer'>
          <button
            type='button'
            className='generate-quiz-button'
            disabled={!file || busy}
            onClick={handleGenerate}
          >
            {busy ? 'Reading PDF…' : 'Read PDF & Find Questions'}
          </button>
        </div>
        {progress && <p className='generate-quiz-feedback'>{progress}</p>}
        {error && (
          <p className='generate-quiz-error' role='alert'>
            {error}
          </p>
        )}
        {questions.length > 0 && (
          <div className='generated-quiz-review'>
            <h2>Review detected questions</h2>
            <p>Check the answers detected from your PDF before practicing.</p>
            <label htmlFor='practice-order'>Question order</label>
            <select
              id='practice-order'
              value={practiceOrder}
              onChange={(event) =>
                setPracticeOrder(event.target.value as 'ordered' | 'random')
              }
            >
              <option value='ordered'>In document order</option>
              <option value='random'>Shuffle questions</option>
            </select>
            <ol>
              {questions.map((question, index) => (
                <li key={index}>
                  <strong>{question.question}</strong>
                  <ul>
                    {question.answers.map((answer) => (
                      <li key={answer.id}>
                        {answer.text}
                        {answer.isCorrect ? ' ✓' : ''}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <button
              type='button'
              className='generate-quiz-button'
              onClick={handleSave}
            >
              Save & Start Practice
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
