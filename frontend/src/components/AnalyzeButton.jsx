import "./AnalyzeButton.css";

export default function AnalyzeButton({ disabled, loading, onClick }) {
  return (
    <button
      type="button"
      className="analyze-btn"
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={loading ? "Analyzing resume" : "Analyze resume"}
    >
      {loading ? (
        <>
          <span className="analyze-btn__spinner" aria-hidden="true" />
          Analyzing...
        </>
      ) : (
        <>
          Analyze Resume <span aria-hidden="true">→</span>
        </>
      )}
    </button>
  );
}
