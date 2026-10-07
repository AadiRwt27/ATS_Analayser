// frontend/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    return body.detail || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function analyzeResume({ resume, jobDescription }) {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("job_description", jobDescription);

  const analyzeResponse = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!analyzeResponse.ok) {
    throw new Error(await parseErrorMessage(analyzeResponse));
  }

  const analysis = await analyzeResponse.json();

  const suggestionsResponse = await fetch(`${API_BASE_URL}/api/suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ats_score: analysis.ats_score,
      matched_skills: analysis.matched_skills,
      missing_skills: analysis.missing_skills,
      keyword_match_percentage: analysis.keyword_match_percentage,
    }),
  });

  const suggestionsData = suggestionsResponse.ok
    ? await suggestionsResponse.json()
    : { suggestions: [] };

  return {
    score: analysis.ats_score,
    matched_skills: analysis.matched_skills,
    missing_skills: analysis.missing_skills,
    important_keywords: [...analysis.matched_skills, ...analysis.missing_skills],
    weak_areas: suggestionsData.suggestions.map((item) => item.title),
  };
}