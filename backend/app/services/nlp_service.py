import re
from collections import Counter

import nltk

# Gracefully download required NLTK resources if not already present
for resource in ["stopwords", "wordnet", "punkt", "punkt_tab"]:
    try:
        nltk.data.find(f"corpora/{resource}" if resource in ["stopwords", "wordnet"] else f"tokenizers/{resource}")
    except LookupError:
        nltk.download(resource, quiet=True)

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


STOP_WORDS = set(stopwords.words("english"))
LEMMATIZER = WordNetLemmatizer()

TECH_SKILLS = {
    "python", "java", "c++", "c#", "javascript", "typescript",
    "react", "angular", "vue", "node.js", "fastapi", "django",
    "flask", "html", "css", "sql", "mysql", "postgresql",
    "mongodb", "redis", "docker", "kubernetes", "aws", "azure",
    "gcp", "git", "github", "linux", "tensorflow", "pytorch",
    "scikit-learn", "machine learning", "deep learning",
    "natural language processing", "nlp", "data science",
    "data analysis", "rest api"
}


def preprocess_text(text: str) -> dict:
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()

    tokens = word_tokenize(text)

    tokens = [
        token
        for token in tokens
        if token not in STOP_WORDS
        and len(token) > 1
    ]

    lemmas = [
        LEMMATIZER.lemmatize(token)
        for token in tokens
    ]

    return {
        "text": text,
        "tokens": lemmas,
        "token_set": set(lemmas),
        "frequency": Counter(lemmas)
    }


def extract_skills(
    text: str,
    token_set: set[str]
) -> set[str]:

    skills = set()

    for skill in TECH_SKILLS:
        if " " in skill:
            if skill in text:
                skills.add(skill)
        elif skill in token_set:
            skills.add(skill)

    return skills


def analyze_resume(
    resume_text: str,
    job_description: str
) -> dict:

    resume = preprocess_text(resume_text)
    job = preprocess_text(job_description)

    resume_skills = extract_skills(
        resume["text"],
        resume["token_set"]
    )

    job_skills = extract_skills(
        job["text"],
        job["token_set"]
    )

    matched_skills = resume_skills & job_skills
    missing_skills = job_skills - resume_skills

    matched_keywords = (
        resume["token_set"] &
        job["token_set"]
    )

    keyword_score = (
        len(matched_keywords)
        / len(job["token_set"])
        * 100
        if job["token_set"]
        else 0
    )

    return {
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "keyword_match_percentage": round(
            keyword_score,
            2
        )
    }
