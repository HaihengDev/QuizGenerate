import { useRef, useState } from 'react';
import type { FileDropZoneProps } from '../interfaces/componentProps';
import './style/file-drop-zone.css';

export default function FileDropZone({
  accept = '.pdf',
  maxSize = 10,
  onFileSelect,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (selectedFile: File) => {
    setError('');

    const maxSizeBytes = maxSize * 1024 * 1024;

    if (selectedFile.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSize}MB.`);
      return false;
    }

    return true;
  };

  const handleFile = (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    onFileSelect?.(selectedFile);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setFile(null);
    setError('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    onFileSelect?.(null);
  };

  return (
    <div className="file-upload">
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          hidden
        />

        {!file ? (
          <>
            <div className="upload-icon">↑</div>

            <p className="upload-title">Drag & drop your file here</p>

            <p className="upload-subtitle">
              or <span>choose a file</span>
            </p>

            <small>Maximum file size: {maxSize}MB</small>
          </>
        ) : (
          <div className="selected-file">
            <div>
              <strong>{file.name}</strong>
              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleRemove();
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
