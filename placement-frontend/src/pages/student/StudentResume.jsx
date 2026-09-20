import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentAPI } from "../../services/api";

function StudentResume() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadResumeData = () => {
    studentAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading dashboard stats:", err));

    studentAPI.getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error loading profile:", err));
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  const atsScore = stats?.atsScore ?? profile?.atsScore ?? 0;
  const uploadedResume = profile?.resumeUrl || profile?.resume;
  const hasResume = Boolean(uploadedResume);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setUploadMessage("");
    }
  };

  const handleUpload = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await studentAPI.uploadResume(file);
      setUploadMessage("Resume uploaded successfully.");
      setFileName("");
      loadResumeData();
    } catch (error) {
      setUploadMessage(error.response?.data?.error || "Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="resume-page">

        <div className="resume-heading">
          <div>
            <h1>My Resume</h1>
            <p>Upload and manage your resume for placement opportunities.</p>
          </div>
        </div>

        <div className="resume-upload-card">
          <div className="upload-icon">📄</div>

          <h2>Upload Your Resume</h2>

          <p>
            Upload your latest resume in PDF format.
          </p>

          <label className="upload-btn">
            Choose Resume
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {fileName && (
            <div>
              <div className="selected-file">
                <span>📎 {fileName}</span>
                <span className="file-status">Selected</span>
              </div>
              <button type="button" className="upload-btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          )}
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>

        <div className="resume-grid">

          <section className="resume-card">
            <h2>Resume Status</h2>

            <div className="resume-status">
              <div>
                <span>Status</span>
                <strong>
                  {hasResume ? "Resume Uploaded" : "No Resume Uploaded"}
                </strong>
              </div>

              <div>
                <span>Format</span>
                <strong>PDF</strong>
              </div>
            </div>
          </section>

          <section className="resume-card">
            <h2>AI Resume Analysis</h2>

            <div className="ats-score">
              <div className="score-circle">
                {atsScore}%
              </div>

              <div>
                <h3>
                  {atsScore >= 80 ? "Excellent Resume" : atsScore >= 60 ? "Good Resume" : "Needs Improvement"}
                </h3>
                <p>
                  {hasResume
                    ? "Your resume ATS compatibility score."
                    : "Upload a resume to generate an ATS score."}
                </p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default StudentResume;
