import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";

function Interviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    companyAPI.getInterviews()
      .then((res) => setInterviews(res.data || []))
      .catch((err) => console.error("Error loading company interviews:", err));
  }, []);

  const scheduledCount = interviews.filter((i) => i.status === "scheduled" || i.status === "Scheduled").length;

  return (
    <CompanyLayout>

      <div className="company-page">

        {/* HEADER */}

        <div className="company-heading">

          <div>
            <h1>Interviews</h1>

            <p>
              Schedule and manage interviews with shortlisted students.
            </p>
          </div>

        </div>


        {/* STATS */}

        <div className="company-stats">

          <div className="company-stat-card">

            <div className="company-stat-icon">
              📅
            </div>

            <div>
              <span>Total Interviews</span>

              <strong>
                {interviews.length}
              </strong>

              <p>All candidates</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              🟢
            </div>

            <div>
              <span>Scheduled</span>

              <strong>
                {scheduledCount}
              </strong>

              <p>Upcoming interviews</p>
            </div>

          </div>

        </div>


        {/* INTERVIEW LIST */}

        <section className="company-section">

          <div className="company-section-header">

            <div>
              <h2>Interview Schedule</h2>

              <p>
                Manage upcoming and pending student interviews.
              </p>
            </div>

          </div>


          <div className="interviews-list">

            {interviews.length > 0 ? (
              interviews.map((interview) => {
                const studentName = interview.student?.userId?.name || 'Student Candidate';
                const studentEmail = interview.student?.userId?.email || 'N/A';
                const role = interview.placementDrive?.jobRole || interview.round || 'Technical Interview';
                const scheduledDate = interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleDateString() : 'TBD';
                const scheduledTime = interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD';

                return (
                  <div
                    className="interview-card"
                    key={interview._id}
                  >

                    {/* STUDENT */}

                    <div className="interview-student">

                      <div className="interview-avatar">
                        {studentName.charAt(0).toUpperCase()}
                      </div>

                      <div>

                        <h3>
                          {studentName}
                        </h3>

                        <p>
                          {studentEmail}
                        </p>

                        <span>
                          {role}
                        </span>

                      </div>

                    </div>


                    {/* DATE & TIME */}

                    <div className="interview-date">

                      <span>Date & Time</span>

                      <strong>
                        📅 {scheduledDate}
                      </strong>

                      <strong>
                        🕐 {scheduledTime}
                      </strong>

                    </div>


                    {/* MODE */}

                    <div className="interview-mode">

                      <span>Location / Mode</span>

                      <strong>
                        💻 {interview.location || 'Online'}
                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="interview-status-box">

                      <span className="interview-scheduled">
                        {interview.status ? interview.status.toUpperCase() : 'SCHEDULED'}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="interview-actions">

                      {interview.joinLink && (
                        <button
                          className="join-btn"
                          onClick={() => window.open(interview.joinLink, "_blank")}
                        >
                          🔗 Meeting Link
                        </button>
                      )}

                    </div>

                  </div>
                );
              })
            ) : (
              <p className="no-data">No interviews currently scheduled.</p>
            )}

          </div>

        </section>

      </div>

    </CompanyLayout>
  );
}

export default Interviews;