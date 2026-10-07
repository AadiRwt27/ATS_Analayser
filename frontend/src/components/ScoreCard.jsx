import { getScoreBand } from "../utils/mockAnalysis";
import "./ScoreCard.css";

export default function ScoreCard({ score }) {
  const { label, tone } = getScoreBand(score);
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className={`score-card score-card--${tone}`}>
      <div
        className="score-card__ring"
        style={{ "--pct": `${clamped}%` }}
        role="img"
        aria-label={`ATS score ${score} out of 100, ${label}`}
      >
        <div className="score-card__ring-inner">
          <span className="score-card__number">{score}</span>
          <span className="score-card__denominator">/ 100</span>
        </div>
      </div>

      <div className="score-card__meta">
        <p className="score-card__eyebrow">ATS Score</p>
        <p className="score-card__label">{label}</p>
      </div>
    </div>
  );
}
