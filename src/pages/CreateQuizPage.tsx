import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CreateQuizQuestion from '../components/CreateQuizQuestion';
import CreatedQuestion from '../components/CreatedQuestion';

import type {
  QuizFileRecord,
  QuizQuestion,
} from '../interfaces/componentProps';
import {
  createQuizFile,
  getAllQuizFiles,
  getQuizFileById,
  updateQuizFile,
} from '../utils/quizStorage';

import './style/create-quiz-page.css';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { fileId } = useParams();

  const [allFiles, setAllFiles] = useState<QuizFileRecord[]>(() =>
    getAllQuizFiles(),
  );

  const [activeFileId, setActiveFileId] = useState<number | null>(() => {
    const parsedFileId = Number(fileId);
    return Number.isFinite(parsedFileId) && parsedFileId > 0
      ? parsedFileId
      : null;
  });

  const [activeFileTitle, setActiveFileTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null,
  );
  const [newFileTitle, setNewFileTitle] = useState('');

  useEffect(() => {
    const files = getAllQuizFiles();
    setAllFiles(files);

    const parsedFileId = Number(fileId);

    if (Number.isFinite(parsedFileId) && parsedFileId > 0) {
      const targetFile = files.find((file) => file.id === parsedFileId);

      if (targetFile) {
        setActiveFileId(targetFile.id);
        setActiveFileTitle(targetFile.title);
        setQuestions(targetFile.quiz ?? []);
        return;
      }
    }

    setActiveFileId(null);
    setActiveFileTitle('');
    setQuestions([]);
  }, [fileId]);

  const handleCreateFile = () => {
    const trimmedTitle = newFileTitle.trim();

    if (!trimmedTitle) {
      alert('Please enter a quiz file name.');
      return;
    }

    const createdFile = createQuizFile(trimmedTitle);

    setAllFiles(getAllQuizFiles());
    setActiveFileId(createdFile.id);
    setActiveFileTitle(createdFile.title);
    setQuestions(createdFile.quiz ?? []);
    setNewFileTitle('');
    navigate(`/create-quiz/${createdFile.id}`);
  };

  const handleSelectFile = (selectedId: number) => {
    const selectedFile = getQuizFileById(selectedId);

    if (!selectedFile) {
      return;
    }

    setActiveFileId(selectedFile.id);
    setActiveFileTitle(selectedFile.title);
    setQuestions(selectedFile.quiz ?? []);
    navigate(`/create-quiz/${selectedFile.id}`);
  };

  const handleAddQuestion = () => {
    if (!activeFileId) {
      alert('Please create or select a quiz file first.');
      return;
    }

    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleSubmitQuestion = (question: QuizQuestion) => {
    if (!activeFileId) {
      alert('Please create or select a quiz file first.');
      return;
    }

    const updatedQuestions = editingQuestion
      ? questions.map((item) =>
          item === editingQuestion ? { ...question } : item,
        )
      : [...questions, question];

    const savedFile = updateQuizFile(activeFileId, updatedQuestions);

    if (!savedFile) {
      alert('This quiz file could not be saved. Please create a new one.');
      return;
    }

    setQuestions(savedFile.quiz ?? []);
    setAllFiles(getAllQuizFiles());
    handleCloseQuestionForm();
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (question: QuizQuestion) => {
    const nextQuestions = questions.filter((item) => item !== question);

    if (!activeFileId) {
      return;
    }

    const savedFile = updateQuizFile(activeFileId, nextQuestions);

    if (!savedFile) {
      alert('This quiz file could not be updated.');
      return;
    }

    setQuestions(savedFile.quiz ?? []);
    setAllFiles(getAllQuizFiles());
  };

  const handleCloseQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseQuestionForm();
    }
  };

  return (
    <main className='create-quiz-page'>
      <header className='create-quiz-page-header'>
        <div className='create-quiz-page-title'>
          <span className='create-quiz-label'>Quiz</span>

          <h1>Create Quiz</h1>

          <p>Create questions and select one or more correct answers.</p>
        </div>

        <div className='create-quiz-actions'>
          <button
            type='button'
            className='add-question-btn'
            onClick={handleAddQuestion}
          >
            <span>+</span>
            Add Question
          </button>

          <button
            type='button'
            className='secondary-btn'
            onClick={() => {
              setActiveFileId(null);
              setActiveFileTitle('');
              setQuestions([]);
              setNewFileTitle('');
              navigate('/create-quiz');
            }}
          >
            New File
          </button>
        </div>
      </header>

      <section className='quiz-file-creator-panel'>
        {!activeFileId ? (
          <div className='quiz-file-creator-box'>
            <label htmlFor='new-file-title'>Quiz File Name</label>

            <div className='quiz-file-creator-row'>
              <input
                id='new-file-title'
                type='text'
                value={newFileTitle}
                onChange={(e) => setNewFileTitle(e.target.value)}
                placeholder='Enter quiz file name'
              />

              <button
                type='button'
                className='primary-btn'
                onClick={handleCreateFile}
              >
                Create File
              </button>
            </div>
          </div>
        ) : (
          <div className='quiz-file-creator-box'>
            <div className='active-file-meta'>
              <span className='active-file-label'>Active File</span>
              <h2>{activeFileTitle}</h2>
            </div>

            <div className='existing-file-picker'>
              <label htmlFor='file-select'>Choose another file</label>

              <select
                id='file-select'
                value={String(activeFileId)}
                onChange={(e) => handleSelectFile(Number(e.target.value))}
              >
                {allFiles.map((file) => (
                  <option key={file.id} value={String(file.id)}>
                    {file.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      <CreatedQuestion
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />

      {showQuestionForm && (
        <div
          className='question-modal-overlay'
          onMouseDown={handleOverlayClick}
        >
          <div
            className='question-modal'
            role='dialog'
            aria-modal='true'
            aria-labelledby='question-modal-title'
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
