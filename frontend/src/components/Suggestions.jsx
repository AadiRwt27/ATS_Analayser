import "./Suggestions.css";

export default function Suggestions({ areas }) {
  return (
    <div className="suggestions">
      <h3 className="suggestions__heading">Areas to Improve</h3>
      <ul className="suggestions__list">
        {areas.map((area) => (
          <li key={area} className="suggestions__item">
            {area}
          </li>
        ))}
      </ul>
      <p className="suggestions__note">
        Focus on these areas to improve your resume's alignment with the job
        description.
      </p>
    </div>
  );
}
