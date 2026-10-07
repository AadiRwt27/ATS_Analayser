import { useCallback, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import AnalyzeButton from "./components/AnalyzeButton";
import Loading from "./components/Loading";
import Results from "./components/Results";
import { analyzeResume } from "./utils/api";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const analyzerRef = useRef(null);

  const canAnalyze = Boolean(resume) && jobDescription.trim().length > 0;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze || loading) return;

    setLoading(true);
    setResults(null);

    // Swap this call for a real request (e.g. POST /api/analyze) in Phase 2.
    const data = await analyzeResume({ resume, jobDescription });

    setResults(data);
    setLoading(false);
  }, [canAnalyze, loading, resume, jobDescription]);

  const handleReset = useCallback(() => {
    setResume(null);
    setJobDescription("");
    setResults(null);
    setLoading(false);
    analyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="analyzer" id="analyzer" ref={analyzerRef}>
          <div className="container">
            <div className="analyzer__card">
              <div className="analyzer__intro">
                <h2 className="analyzer__heading">Analyze Your Resume</h2>
                <p className="analyzer__description">
                  Upload your resume and paste the job description to see how
                  well your resume matches the position.
                </p>
              </div>

              <div className="analyzer__columns">
                <ResumeUpload resume={resume} onResumeChange={setResume} />
                <JobDescription value={jobDescription} onChange={setJobDescription} />
              </div>

              <div className="analyzer__action">
                <AnalyzeButton
                  disabled={!canAnalyze}
                  loading={loading}
                  onClick={handleAnalyze}
                />
              </div>
            </div>

            <div className="analyzer__output">
              {loading && <Loading />}
              {!loading && results && <Results results={results} onReset={handleReset} />}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Resume ATS Analyzer &mdash; Phase 1 preview, running entirely in your browser.</p>
        </div>
      </footer>
    </>
  );
}
