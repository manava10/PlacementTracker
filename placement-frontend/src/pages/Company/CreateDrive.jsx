import { useState } from "react";
import { Link } from "react-router-dom";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";

function CreateDrive() {
  const [formData, setFormData] = useState({
    title: "",
    package: "",
    location: "",
    type: "",
    skills: "",
    lastDate: "",
    description: "",
  });

  const [created, setCreated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await companyAPI.createDrive({
        title: formData.title,
        jobRole: formData.title,
        salary: Number(formData.package.replace(/[^0-9.]/g, "")) * 100000,
        location: formData.location,
        jobType: formData.type,
        requirements: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        registrationDeadline: formData.lastDate,
        description: formData.description,
        positions: 1
      });
      setCreated(true);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to create placement drive.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CompanyLayout>

      <div className="create-drive-page">

        <div className="create-drive-header">
          <div>
            <h1>Create Placement Drive</h1>
            <p>
              Create a new job opportunity for eligible students.
            </p>
          </div>

          <Link to="/company">
            <button className="back-btn">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {!created ? (

          <form
            className="drive-form"
            onSubmit={handleSubmit}
          >

            {error && <p className="login-error">{error}</p>}

            <div className="form-section">

              <h2>Job Details</h2>
              <p>Enter the basic details of the job opportunity.</p>

              <div className="form-grid">

                <div className="form-field">
                  <label>Job Title *</label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Software Engineer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Package *</label>

                  <input
                    type="text"
                    name="package"
                    placeholder="e.g. ₹8 LPA"
                    value={formData.package}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Location *</label>

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Hyderabad"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Job Type *</label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Job Type
                    </option>

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Intern + Full Time">
                      Intern + Full Time
                    </option>
                  </select>
                </div>

              </div>

            </div>

            <div className="form-section">

              <h2>Eligibility & Requirements</h2>
              <p>
                Specify the skills required for this position.
              </p>

              <div className="form-field">

                <label>Required Skills *</label>

                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. Java, Spring Boot, SQL, React"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />

                <span className="field-help">
                  Separate multiple skills using commas.
                </span>

              </div>

              <div className="form-field">

                <label>Application Deadline *</label>

                <input
                  type="date"
                  name="lastDate"
                  value={formData.lastDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-section">

              <h2>Job Description</h2>
              <p>
                Provide details about the role and responsibilities.
              </p>

              <div className="form-field">

                <label>Description *</label>

                <textarea
                  name="description"
                  rows="6"
                  placeholder="Describe the job role, responsibilities and requirements..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-actions">

              <Link to="/company">
                <button
                  type="button"
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </Link>

              <button
                type="submit"
                className="submit-drive-btn"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Placement Drive"}
              </button>

            </div>

          </form>

        ) : (

          <div className="drive-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>Placement Drive Created!</h2>

            <p>
              Your placement drive has been created successfully.
            </p>

            <div className="created-drive-card">

              <h3>{formData.title}</h3>

              <p>
                {formData.type} • {formData.package}
              </p>

              <div className="created-drive-details">

                <span>
                  📍 {formData.location}
                </span>

                <span>
                  📅 Closes {formData.lastDate}
                </span>

                <span>
                  🛠 {formData.skills}
                </span>

              </div>

            </div>

            <Link to="/company">
              <button className="dashboard-btn">
                Go to Company Dashboard
              </button>
            </Link>

          </div>

        )}

      </div>

    </CompanyLayout>
  );
}

export default CreateDrive;