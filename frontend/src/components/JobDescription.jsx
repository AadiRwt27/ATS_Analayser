import { useId } from "react";
import "./JobDescription.css";

const MAX_LENGTH = 5000;

export default function JobDescription({ value, onChange }) {
  const textareaId = useId();
  const counterId = useId();

  const isNearLimit = value.length >= MAX_LENGTH * 0.9;

  return (
    <div className="job-description">
      <label className="job-description__label" htmlFor={textareaId}>
        Job Description
      </label>

      <textarea
        id={textareaId}
        className="job-description__textarea"
        placeholder="Paste the job description here..."
        value={value}
        maxLength={MAX_LENGTH}
        aria-describedby={counterId}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_LENGTH))}
      />

      <p
        id={counterId}
        className={`job-description__counter ${isNearLimit ? "job-description__counter--near" : ""}`}
      >
        {value.length} / {MAX_LENGTH}
      </p>
    </div>
  );
}
