import { useCallback, useId, useRef, useState } from "react";
import "./ResumeUpload.css";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function validateFile(file) {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const hasValidType =
    ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);

  if (!hasValidType) {
    return "Please upload a PDF or DOCX file.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `That file is ${formatSize(file.size)}. Max size is 5MB.`;
  }
  return null;
}

export default function ResumeUpload({ resume, onResumeChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const errorId = useId();

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onResumeChange(null);
        return;
      }

      setError(null);
      onResumeChange(file);
    },
    [onResumeChange]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleRemove = () => {
    setError(null);
    onResumeChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="upload">
      <label className="upload__label" htmlFor={inputId}>
        Upload Your Resume
      </label>

      {!resume ? (
        <div
          className={`upload__dropzone ${isDragging ? "upload__dropzone--active" : ""} ${
            error ? "upload__dropzone--error" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <svg
            className="upload__icon"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            aria-hidden="true"
          >
            <path
              d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 15.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <p className="upload__primary-text">Drag &amp; drop your resume here</p>
          <p className="upload__or">or</p>
          <button
            type="button"
            className="upload__browse"
            onClick={() => inputRef.current?.click()}
          >
            Browse Files
          </button>
          <p className="upload__hint">PDF or DOCX &bull; Max 5MB</p>

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            className="visually-hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      ) : (
        <div className="upload__file">
          <span className="upload__file-check" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="16" height="16">
              <path
                d="M4 10.5L8 14.5L16 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="upload__file-info">
            <p className="upload__file-name">{resume.name}</p>
            <p className="upload__file-size">{formatSize(resume.size)}</p>
          </div>
          <button
            type="button"
            className="upload__remove"
            onClick={handleRemove}
            aria-label={`Remove ${resume.name}`}
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="upload__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
