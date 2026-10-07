// Mock analysis engine for Phase 1.
//
// In Phase 2 this file's `analyzeResume` export will be replaced with a
// real request to the FastAPI backend (e.g. POST /api/analyze). Every
// caller only depends on this function's signature and return shape, so
// swapping the implementation later shouldn't require touching any
// component.

const MOCK_RESULTS = {
  score: 78,
  matched_skills: ["Python", "React", "FastAPI", "SQL", "Git"],
  missing_skills: ["Docker", "AWS", "Kubernetes"],
  important_keywords: ["REST API", "Microservices", "Cloud", "CI/CD", "Agile"],
  weak_areas: ["Cloud deployment", "DevOps", "Quantifiable achievements"],
};

const MOCK_DELAY_MS = 1750;

/**
 * Simulates sending the resume + job description to a backend for
 * analysis. Resolves with the same shape the real API will eventually
 * return.
 *
 * @param {{ resume: File, jobDescription: string }} input
 * @returns {Promise<typeof MOCK_RESULTS>}
 */
export function analyzeResume({ resume, jobDescription } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...MOCK_RESULTS });
    }, MOCK_DELAY_MS);
  });
}

/**
 * Buckets a numeric ATS score into a human label and a semantic tone
 * used for coloring (good / average / poor / excellent).
 */
export function getScoreBand(score) {
  if (score >= 85) return { label: "Excellent Match", tone: "excellent" };
  if (score >= 70) return { label: "Good Match", tone: "good" };
  if (score >= 50) return { label: "Average Match", tone: "average" };
  return { label: "Poor Match", tone: "poor" };
}
