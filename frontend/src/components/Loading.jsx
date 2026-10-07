import { useEffect, useState } from "react";
import "./Loading.css";

const STEPS = [
  "Reading resume contents",
  "Scanning job description",
  "Matching skills & keywords",
];

export default function Loading() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((index) => (index + 1) % STEPS.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <p className="loading__title">Analyzing your resume...</p>
      <p className="loading__step">{STEPS[stepIndex]}</p>
    </div>
  );
}
