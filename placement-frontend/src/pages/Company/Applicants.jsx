import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    companyAPI.getApplicants()
      .then((res) => setApplicants(res.data || []))
      .catch((err) => console.error("Error loading applicants:", err));
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await companyAPI.updateApplicationStatus(id, newStatus.toLowerCase());
      setApplicants(
        applicants.map((applicant) =>
          applicant._id === id
            ? { ...applicant, status: response.data.status }
            : applicant
        )
      );
      setMessage(`Status updated to ${newStatus}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <CompanyLayout>

      <div className="company-page">

        {/* HEADER */}

        <div className="company-heading">

          <div>
            <h1>Applicants</h1>

            <p>
              Review and manage students who applied to your placement drives.
            </p>
          </div>

        </div>

        {message && <p className="status-msg">{message}</p>}

        {/* STATS */}

        <div className="company-stats">

          <div className="company-stat-card">
            <div className="company-stat-icon">
              👥
            </div>

            <div>
              <span>Total Applicants</span>
              <strong>{applicants.length}</strong>
              <p>Across all drives</p>
            </div>
          </div>


          <div className="company-stat-card">
            <div className="company-stat-icon">
              ⏳
            </div>

            <div>
              <span>Applied / Pending</span>

              <strong>
                {
                  applicants.filter(
                    (a) => a.status === "applied"
                  ).length
                }
              </strong>

              <p>Need review</p>
            </div>
          </div>


          <div className="company-stat-card">
            <div className="company-stat-icon">
              ⭐
            </div>

            <div>
              <span>Shortlisted</span>

              <strong>
                {
                  applicants.filter(
                    (a) => a.status === "shortlisted"
                  ).length
                }
              </strong>

              <p>Selected for next round</p>
            </div>
          </div>


          <div className="company-stat-card">
            <div className="company-stat-icon">
              ❌
            </div>

            <div>
              <span>Rejected</span>

              <strong>
                {
                  applicants.filter(
                    (a) => a.status === "rejected"
                  ).length
                }
              </strong>

              <p>Not selected</p>
            </div>
          </div>

        </div>

        {/* APPLICANTS */}

        <section className="company-section">

          <div className="company-section-header">

            <div>
              <h2>All Applicants</h2>

              <p>
                Review applicant profiles and take action.
              </p>
            </div>

          </div>


          <div className="applicants-list">

            {applicants.length > 0 ? (
              applicants.map((applicant) => {
                const name = applicant.student?.userId?.name || 'Student Candidate';
                const email = applicant.student?.userId?.email || 'N/A';
                const role = applicant.placementDrive?.jobRole || applicant.placementDrive?.title || 'Application';
                const cgpa = applicant.student?.cgpa != null ? applicant.student.cgpa : 'N/A';
                const ats = applicant.student?.atsScore != null ? applicant.student.atsScore : null;
                const skills = applicant.student?.skills?.join(', ') || 'No skills listed';
                const appliedOn = applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'Recent';

                return (
                  <div
                    className="applicant-card"
                    key={applicant._id}
                  >

                    {/* PROFILE */}

                    <div className="applicant-profile">

                      <div className="applicant-avatar">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <div>

                        <h3>
                          {name}
                        </h3>

                        <p>
                          {email}
                        </p>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="applicant-details">

                      <div>
                        <span>Applied For</span>
                        <strong>{role}</strong>
                      </div>

                      <div>
                        <span>CGPA</span>
                        <strong>{cgpa}</strong>
                      </div>

                      <div>
                        <span>ATS Score</span>

                        <strong className="ats-score">
                          {ats != null ? `${ats}%` : 'N/A'}
                        </strong>
                      </div>

                      <div>
                        <span>Applied On</span>
                        <strong>{appliedOn}</strong>
                      </div>

                    </div>


                    {/* SKILLS */}

                    <div className="applicant-skills">

                      <span>Skills</span>

                      <p>
                        {skills}
                      </p>

                    </div>


                    {/* STATUS */}

                    <div className="applicant-status">

                      <span
                        className={
                          applicant.status === "shortlisted" || applicant.status === "selected"
                            ? "status-shortlisted"
                            : applicant.status === "rejected"
                            ? "status-rejected"
                            : "status-applied"
                        }
                      >
                        {applicant.status ? applicant.status.toUpperCase() : 'APPLIED'}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="applicant-actions">

                      <button
                        className="view-profile-btn"
                        onClick={() => alert(`Candidate: ${name}\nEmail: ${email}\nCGPA: ${cgpa}\nATS Score: ${ats}%\nSkills: ${skills}`)}
                      >
                        View Profile
                      </button>


                      {applicant.status !== "shortlisted" && (
                        <button
                          className="shortlist-btn"
                          onClick={() => updateStatus(applicant._id, "shortlisted")}
                        >
                          ✓ Shortlist
                        </button>
                      )}


                      {applicant.status !== "rejected" && (
                        <button
                          className="reject-btn"
                          onClick={() => updateStatus(applicant._id, "rejected")}
                        >
                          ✕ Reject
                        </button>
                      )}

                    </div>

                  </div>
                );
              })
            ) : (
              <p className="no-data">No candidate applications submitted yet.</p>
            )}

          </div>

        </section>

      </div>

    </CompanyLayout>
  );
}

export default Applicants;