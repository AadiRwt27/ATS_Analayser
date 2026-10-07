import "./Hero.css";

const FEATURES = [
  { label: "Keyword Matching" },
  { label: "Skill Analysis" },
  { label: "Personalized Insights" },
];

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__heading">
            Optimize Your Resume.
            <br />
            Beat the ATS.
            <br />
            Get Hired.
          </h1>
          <p className="hero__subheading">
            Compare your resume with any job description and discover the
            skills, keywords, and areas you should improve.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className="hero__cta-primary"
              onClick={() => scrollToId("#analyzer")}
            >
              Analyze My Resume <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="hero__cta-secondary"
              onClick={() => scrollToId("#how-it-works")}
            >
              How It Works
            </button>
          </div>

          <ul className="hero__features" id="how-it-works">
            {FEATURES.map((feature) => (
              <li key={feature.label} className="hero__feature">
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <path
                    d="M4 10.5L8 14.5L16 5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__ring">
            <div className="hero__ring-value">
              <span className="hero__ring-number">78</span>
              <span className="hero__ring-suffix">/100</span>
            </div>
          </div>
          <div className="hero__floating hero__floating--a">Matched: React</div>
          <div className="hero__floating hero__floating--b">Missing: Docker</div>
        </div>
      </div>
    </section>
  );
}
