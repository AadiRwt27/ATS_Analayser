def test_suggestions_success(client):
    response = client.post(
        "/api/suggestions",
        json={
            "ats_score": 78,
            "matched_skills": ["Python", "React"],
            "missing_skills": ["Docker", "AWS"],
            "keyword_match_percentage": 74.5,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert "summary" in body
    assert isinstance(body["suggestions"], list)
    assert len(body["suggestions"]) >= 1


def test_suggestions_invalid_request_body(client):
    response = client.post(
        "/api/suggestions",
        json={"matched_skills": ["Python"]},  # missing required fields
    )
    assert response.status_code == 422


def test_suggestions_invalid_score_range(client):
    response = client.post(
        "/api/suggestions",
        json={
            "ats_score": 150,  # out of 0-100 range
            "matched_skills": [],
            "missing_skills": [],
            "keyword_match_percentage": 50.0,
        },
    )
    assert response.status_code == 422
