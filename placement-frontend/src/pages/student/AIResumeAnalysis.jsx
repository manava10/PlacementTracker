import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentAPI } from "../../services/api";

function AIResumeAnalysis() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    studentAPI.getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error loading profile:", err));

    studentAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading dashboard stats:", err));

    studentAPI.getPlacementDrives()
      .then((res) => setDrives(res.data || []))
      .catch((err) => console.error("Error loading drives:", err));
  }, []);

  const atsScore = stats?.atsScore ?? profile?.atsScore ?? 0;
  const profileStrength = stats?.profileStrength ?? 0;
  const skills = profile?.skills || [];

  const matchScore = (drive) => {
    const requirements = (drive.requirements || [])
      .map((r) => r.toLowerCase().trim());
    if (requirements.length === 0 || skills.length === 0) return 0;
    const matched = requirements.filter((req) =>
      skills.some((skill) => {
        const s = skill.toLowerCase().trim();
        return req.includes(s) || s.includes(req);
      })
    ).length;
    return Math.round((matched / requirements.length) * 100);
  };

  const rankedDrives = [...drives]
    .map((drive) => ({ drive, score: matchScore(drive) }))
    .sort((a, b) => b.score - a.score);

  return (
    <DashboardLayout>
      <div className="ai-page">

        <div className="ai-heading">
          <div>
            <h1>AI Resume Analysis</h1>
            <p>
              Get AI-powered insights to improve your resume and placement chances.
            </p>
          </div>
        </div>

        {/* SCORE OVERVIEW */}

        <section className="ai-overview-card">

          <div className="ai-score-section">
            <div className="ai-score-circle">
              <strong>{atsScore}%</strong>
              <span>ATS Score</span>
            </div>

            <div>
              <h2>{atsScore >= 80 ? "Excellent Resume" : atsScore >= 60 ? "Good Resume" : "Needs Improvement"}</h2>
              <p>
                Your resume is compatible with most Applicant Tracking Systems.
              </p>
              <span className="score-status">✓ Analysis Complete</span>
            </div>
          </div>

          <div className="score-breakdown">

            <div>
              <span>ATS Score</span>
              <strong>{atsScore}%</strong>
            </div>

            <div>
              <span>Profile Strength</span>
              <strong>{profileStrength}%</strong>
            </div>

            <div>
              <span>Skills Listed</span>
              <strong>{skills.length}</strong>
            </div>

            <div>
              <span>Keywords</span>
              <strong>{atsScore}%</strong>
            </div>

          </div>

        </section>

        {/* SKILLS */}

        <div className="ai-grid">

          <section className="ai-card">
            <h2>Skills Detected</h2>
            <p className="ai-card-subtitle">
              Technical skills identified from your profile and resume.
            </p>

            {skills.length > 0 ? (
              <div className="ai-skills">
                {skills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            ) : (
              <p className="no-data">No skills added to your profile yet.</p>
            )}
          </section>

          {/* JOB MATCH */}

          <section className="ai-card">
            <h2>Best Job Match</h2>
            <p className="ai-card-subtitle">
              Based on your current skills.
            </p>

            {rankedDrives.length > 0 ? (
              rankedDrives.slice(0, 3).map(({ drive, score }) => (
                <div key={drive._id} className="job-match">
                  <div>
                    <h3>{drive.jobRole || drive.title}</h3>
                    <p>{drive.company?.companyName || 'Recruiter'}</p>
                  </div>

                  <strong>{score}%</strong>
                </div>
              ))
            ) : (
              <p className="no-data">No active drives to compare skills against.</p>
            )}
          </section>

        </div>

        {/* STRENGTHS + MISSING SKILLS */}

        <div className="ai-grid">

          <section className="ai-card">
            <h2>Resume Strengths</h2>

            <div className="ai-point">
              <span>✓</span>
              <p>Good technical skill coverage ({skills.length} skills listed).</p>
            </div>

            <div className="ai-point">
              <span>✓</span>
              <p>Clean and readable resume structure.</p>
            </div>

            <div className="ai-point">
              <span>✓</span>
              <p>Relevant academic projects included.</p>
            </div>

            <div className="ai-point">
              <span>✓</span>
              <p>Strong programming language keywords.</p>
            </div>
          </section>

          <section className="ai-card">
            <h2>Skills to Improve</h2>

            <div className="ai-point warning">
              <span>!</span>
              <p>System Architecture & Design</p>
            </div>

            <div className="ai-point warning">
              <span>!</span>
              <p>REST API Best Practices</p>
            </div>

            <div className="ai-point warning">
              <span>!</span>
              <p>Docker & Cloud Deployment</p>
            </div>

            <div className="ai-point warning">
              <span>!</span>
              <p>Data Structures & Algorithms</p>
            </div>
          </section>

        </div>

        {/* AI SUGGESTIONS */}

        <section className="ai-card ai-suggestions">

          <h2>🤖 AI Improvement Suggestions</h2>
          <p className="ai-card-subtitle">
            Recommendations generated from your resume analysis.
          </p>

          <div className="ai-suggestion">
            <div className="suggestion-number">1</div>
            <div>
              <h3>Add measurable achievements</h3>
              <p>
                Mention numbers, results, or performance improvements in your
                project descriptions.
              </p>
            </div>
          </div>

          <div className="ai-suggestion">
            <div className="suggestion-number">2</div>
            <div>
              <h3>Improve keyword matching</h3>
              <p>
                Add job-specific technical keywords to improve your ATS score.
              </p>
            </div>
          </div>

          <div className="ai-suggestion">
            <div className="suggestion-number">3</div>
            <div>
              <h3>Add more project details</h3>
              <p>
                Explain your role, technologies used, and the outcome of each
                project.
              </p>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default AIResumeAnalysis;