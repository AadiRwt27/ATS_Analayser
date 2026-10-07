"""
AI suggestions service.

Takes the structured analysis results (already computed by
analysis_service.analyze_resume and round-tripped through React) and turns
them into readable, prioritized suggestions for the dashboard.

Puter.js itself runs client-side in React, NOT here — this service only
prepares/relays structured suggestion data. If a server-side LLM call is
ever added instead of/alongside Puter.js, it belongs inside this file and
nowhere else.
"""

from app.schemas.suggestions import SuggestionItem, SuggestionsRequest, SuggestionsResponse


async def generate_suggestions(payload: SuggestionsRequest) -> SuggestionsResponse:
    """
    Generate improvement suggestions from a completed analysis.

    TODO (Phase 2):
        Replace this placeholder logic with real suggestion generation,
        e.g. ranking missing_skills by importance, pulling phrasing tips
        from a rules engine, or forwarding context to an LLM.
    """

    suggestions: list[SuggestionItem] = []

    for skill in payload.missing_skills:
        suggestions.append(
            SuggestionItem(
                title=f"Add {skill} experience",
                description=(
                    f"The job description references {skill}, but it wasn't found in your "
                    f"resume. Mention it if you've used it, even in a small project."
                ),
                priority="high" if payload.ats_score < 70 else "medium",
            )
        )

    if payload.keyword_match_percentage < 80:
        suggestions.append(
            SuggestionItem(
                title="Improve keyword coverage",
                description=(
                    "Your resume matches only "
                    f"{payload.keyword_match_percentage:.0f}% of the key terms in the job "
                    "description. Mirror the job posting's language where it genuinely applies."
                ),
                priority="medium",
            )
        )

    summary = (
        f"Your resume scores {payload.ats_score}/100 against this job description. "
        f"{'Strong match — ' if payload.ats_score >= 70 else 'A few gaps to close — '}"
        f"{len(payload.missing_skills)} skill(s) to address."
    )

    return SuggestionsResponse(summary=summary, suggestions=suggestions)
