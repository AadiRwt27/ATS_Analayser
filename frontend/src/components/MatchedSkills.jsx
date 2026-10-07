import "./SkillList.css";

export default function MatchedSkills({ skills }) {
  return (
    <div className="skill-panel skill-panel--matched">
      <h3 className="skill-panel__heading">Matched Skills</h3>
      <ul className="skill-panel__list">
        {skills.map((skill) => (
          <li key={skill} className="skill-panel__item">
            <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
              <path
                d="M4 10.5L8 14.5L16 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
