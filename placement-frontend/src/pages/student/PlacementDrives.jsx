import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentAPI } from "../../services/api";

function PlacementDrives() {
  const [applied, setApplied] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [profileStrength, setProfileStrength] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    studentAPI.getPlacementDrives()
      .then((response) => setJobs(response.data))
      .catch(() => setMessage("Unable to load placement drives."))
      .finally(() => setLoading(false));

    studentAPI.getApplications()
      .then((response) => {
        const ids = (response.data || [])
          .map((a) => a.placementDrive?._id || a.placementDrive)
          .filter(Boolean);
        setApplied(ids);
      })
      .catch(() => {});

    studentAPI.getDashboard()
      .then((response) => setProfileStrength(response.data?.profileStrength ?? null))
      .catch(() => {});
  }, []);

  const handleApply = async (id) => {
    try {
      await studentAPI.applyForDrive(id);
      setApplied((current) =>
        current.includes(id) ? current : [...current, id]
      );
    } catch (error) {
      setMessage(error.response?.data?.error || "Unable to apply for this drive.");
    }
  };

  return (
    <DashboardLayout>
      <div className="drives-page">
        <div className="drives-heading">
          <div>
            <h1>Placement Drives</h1>
            <p>Explore companies and apply for suitable opportunities.</p>
          </div>
        </div>

        <div className="drive-summary">
          <div><span>Available Drives</span><strong>{jobs.length}</strong></div>
          <div><span>Applications</span><strong>{applied.length}</strong></div>
          <div>
            <span>Profile Strength</span>
            <strong>{profileStrength !== null ? `${profileStrength}%` : "--"}</strong>
          </div>
        </div>

        <div className="drives-list">
          {loading && <p>Loading placement drives...</p>}
          {!loading && jobs.length === 0 && <p>{message || "No placement drives are available right now."}</p>}
          {message && jobs.length > 0 && <p>{message}</p>}

          {jobs.map((job) => (
            <div className="drive-card" key={job._id}>
              <div className="company-logo">{job.company?.companyName?.charAt(0) || "C"}</div>
              <div className="drive-main">
                <div className="drive-top">
                  <div>
                    <h2>{job.jobRole || job.title}</h2>
                    <h3>{job.company?.companyName || "Company"}</h3>
                  </div>
                  <span className="job-type">{job.jobType || "Full Time"}</span>
                </div>
                <div className="drive-details">
                  <span>Salary: ₹{job.salary?.toLocaleString() || "Not specified"}</span>
                  <span>Location: {job.location || "Not specified"}</span>
                  <span>Eligibility: CGPA {job.eligibility?.minCGPA || 0}+</span>
                </div>
                <div className="drive-skills">
                  <strong>Required Skills:</strong>
                  <span>{job.requirements?.join(", ") || "See job description"}</span>
                </div>
              </div>
              <div className="drive-action">
                <button
                  className={applied.includes(job._id) ? "applied-btn" : "apply-btn"}
                  onClick={() => handleApply(job._id)}
                  disabled={applied.includes(job._id)}
                >
                  {applied.includes(job._id) ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PlacementDrives;