import { useState } from 'react';
import FileDropZone from '../components/FileDropZone';
import './style/generate-quiz.css';

const Page = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleGenerate = () => {
    if (!file) return;

    // PDF → JSON → Quiz generation
    console.log('Generating quiz from:', file.name);
  };

  return (
    <section id="generate-quiz-form-container">
      <header className="generate-quiz-header">
        <h1>Generate Quiz</h1>

        <p>
          Upload a PDF document and turn its content into an interactive quiz.
        </p>
      </header>

      <div className="generate-quiz-card">
        <h2 className="generate-quiz-section-title">Upload your PDF</h2>

        <p className="generate-quiz-section-description">
          Select a PDF file containing the material you want to use for your
          quiz.
        </p>

        <div className="generate-quiz-upload">
          <FileDropZone
            accept=".pdf,application/pdf"
            maxSize={20}
            onFileSelect={handleFileSelect}
          />
        </div>

        <div className="generate-quiz-footer">
          <button
            type="button"
            className="generate-quiz-button"
            disabled={!file}
            onClick={handleGenerate}
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </section>
  );
};

export default Page;
