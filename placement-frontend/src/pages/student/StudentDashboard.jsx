import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { studentAPI } from "../../services/api";
import { useAuth } from "../../context/useAuth";

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    studentAPI.getDashboard()
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Unable to load dashboard:", error));

    studentAPI.getPlacementDrives()
      .then((response) => setDrives(response.data || []))
      .catch((error) => console.error("Unable to load drives:", error));

    studentAPI.getInterviews()
      .then((response) => setInterviews(response.data || []))
      .catch((error) => console.error("Unable to load interviews:", error));
  }, []);

  return (
    <DashboardLayout>

      <div className="dashboard-heading">
        <div>
          <h1>Welcome back, {user?.name || "Student"}!</h1>
          <p>Track your placement journey from one place.</p>
        </div>
      </div>

      <div className="stats-grid">

        <StatCard
          title="ATS Score"
          value={stats ? `${stats.atsScore}%` : "--"}
          icon="🤖"
          description="Resume ATS Compatibility"
        />

        <StatCard
          title="Applications"
          value={stats ? stats.applications : "--"}
          icon="📋"
          description="Total active applications"
        />

        <StatCard
          title="Interviews"
          value={stats ? stats.interviews : "--"}
          icon="📅"
          description="Scheduled interviews"
        />

        <StatCard
          title="Profile Strength"
          value={stats ? `${stats.profileStrength}%` : "--"}
          icon="👤"
          description="Overall profile completeness"
        />

      </div>

      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Recommended Opportunities</h2>
            <p>Jobs that match your profile and skills</p>
          </div>

          <Link to="/student/jobs">
            <button>View All</button>
          </Link>
        </div>

        <div className="job-list">
          {drives.length > 0 ? (
            drives.slice(0, 3).map((drive) => (
              <div key={drive._id} className="job-card">
                <div>
                  <h3>{drive.jobRole || drive.title}</h3>
                  <p>{drive.company?.companyName || 'Recruiter'}</p>
                  <span>₹{(drive.salary / 100000).toFixed(1)} LPA • {drive.location || 'Remote'}</span>
                </div>

                <div className="match-score">
                  Active Drive
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No placement drives currently active.</p>
          )}
        </div>

      </section>

      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Upcoming Interview</h2>
            <p>Your next scheduled interview</p>
          </div>
        </div>

        {interviews.length > 0 ? (
          <div className="interview-card">
            <div>
              <h3>{interviews[0].placementDrive?.jobRole || interviews[0].round} — {interviews[0].company?.companyName || 'Company'}</h3>
              <p>{interviews[0].round.toUpperCase()} Round ({interviews[0].status})</p>
            </div>

            <div>
              <strong>{new Date(interviews[0].scheduledDate).toLocaleDateString()}</strong>
              <span>{new Date(interviews[0].scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ) : (
          <p className="no-data">No interviews scheduled yet.</p>
        )}

      </section>

    </DashboardLayout>
  );
}

export default StudentDashboard;