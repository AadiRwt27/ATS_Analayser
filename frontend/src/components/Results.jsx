import ScoreCard from "./ScoreCard";
import MatchedSkills from "./MatchedSkills";
import MissingSkills from "./MissingSkills";
import Suggestions from "./Suggestions";
import "./Results.css";

export default function Results({ results, onReset }) {
  const { score, matched_skills, missing_skills, important_keywords, weak_areas } = results;

  return (
    <div className="results">
      <div className="results__header">
        <div>
          <h2 className="results__heading">Your Results</h2>
          <p className="results__subheading">
            Here's how your resume stacks up against this job description.
          </p>
        </div>
      </div>

      <ScoreCard score={score} />

      <div className="results__grid">
        <MatchedSkills skills={matched_skills} />
        <MissingSkills skills={missing_skills} />
      </div>

      <div className="results__keywords">
        <h3 className="results__keywords-heading">Important Keywords</h3>
        <div className="results__pills">
          {important_keywords.map((keyword) => (
            <span key={keyword} className="results__pill">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <Suggestions areas={weak_areas} />

      <div className="results__actions">
        <button type="button" className="results__reset" onClick={onReset}>
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
