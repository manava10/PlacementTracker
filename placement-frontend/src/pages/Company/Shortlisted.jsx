import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";

function Shortlisted() {
  const [shortlistedStudents, setShortlistedStudents] = useState([]);

  useEffect(() => {
    companyAPI.getShortlisted()
      .then((res) => setShortlistedStudents(res.data || []))
      .catch((err) => console.error("Error loading shortlisted students:", err));
  }, []);

  const totalShortlisted = shortlistedStudents.length;
  const avgAts = totalShortlisted > 0
    ? Math.round(shortlistedStudents.reduce((sum, s) => sum + (s.student?.atsScore || 0), 0) / totalShortlisted)
    : 0;

  return (
    <CompanyLayout>

      <div className="company-page">

        {/* HEADER */}

        <div className="company-heading">

          <div>
            <h1>Shortlisted Students</h1>

            <p>
              Manage students shortlisted for your placement opportunities.
            </p>
          </div>

        </div>


        {/* STATS */}

        <div className="company-stats">

          <div className="company-stat-card">

            <div className="company-stat-icon">
              ⭐
            </div>

            <div>
              <span>Total Shortlisted</span>
              <strong>{totalShortlisted}</strong>
              <p>Students selected</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              📅
            </div>

            <div>
              <span>Interviews Scheduled</span>

              <strong>
                {totalShortlisted}
              </strong>

              <p>Upcoming interviews</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              🎯
            </div>

            <div>
              <span>Average ATS</span>

              <strong>
                {avgAts}%
              </strong>

              <p>Resume match score</p>
            </div>

          </div>

        </div>


        {/* STUDENT LIST */}

        <section className="company-section">

          <div className="company-section-header">

            <div>
              <h2>Shortlisted Candidates</h2>

              <p>
                Students selected for the next stage of the recruitment process.
              </p>
            </div>

          </div>


          <div className="shortlisted-list">

            {shortlistedStudents.length > 0 ? (
              shortlistedStudents.map((app) => {
                const student = app.student;
                const name = student?.userId?.name || 'Candidate';
                const email = student?.userId?.email || 'N/A';
                const role = app.placementDrive?.jobRole || app.placementDrive?.title || 'Application';
                const cgpa = student?.cgpa != null ? student.cgpa : 'N/A';
                const ats = student?.atsScore != null ? student.atsScore : null;
                const skills = student?.skills?.join(', ') || 'No skills listed';

                return (
                  <div
                    className="shortlisted-card"
                    key={app._id}
                  >

                    {/* PROFILE */}

                    <div className="shortlisted-profile">

                      <div className="shortlisted-avatar">
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

                    <div className="shortlisted-details">

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

                    </div>


                    {/* SKILLS */}

                    <div className="shortlisted-skills">

                      <span>Skills</span>

                      <p>
                        {skills}
                      </p>

                    </div>


                    {/* INTERVIEW */}

                    <div className="interview-status">

                      <span className="interview-scheduled">
                        Shortlisted
                      </span>

                    </div>


                    {/* ACTION */}

                    <div className="shortlisted-actions">

                      <button
                        className="view-profile-btn"
                        onClick={() => alert(`Candidate: ${name}\nEmail: ${email}\nCGPA: ${cgpa}\nATS Score: ${ats}%\nSkills: ${skills}`)}
                      >
                        View Profile
                      </button>

                    </div>

                  </div>
                );
              })
            ) : (
              <p className="no-data">No candidate applications currently shortlisted.</p>
            )}

          </div>

        </section>

      </div>

    </CompanyLayout>
  );
}

export default Shortlisted;