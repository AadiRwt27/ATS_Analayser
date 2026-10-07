import "./SkillList.css";

export default function MissingSkills({ skills }) {
  return (
    <div className="skill-panel skill-panel--missing">
      <h3 className="skill-panel__heading">Missing Skills</h3>
      <ul className="skill-panel__list">
        {skills.map((skill) => (
          <li key={skill} className="skill-panel__item">
            <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
              <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
