import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/useAuth";
import { studentAPI } from "../../services/api";

function StudentProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "Student",
    email: user?.email || "",
    rollNumber: "",
    department: "",
    batch: "",
    cgpa: "",
    bio: "",
    skills: ""
  });

  useEffect(() => {
    studentAPI.getProfile()
      .then((res) => {
        if (res.data) {
          const data = res.data;
          setProfile({
            name: data.userId?.name || user?.name || "Student",
            email: data.userId?.email || user?.email || "",
            rollNumber: data.rollNumber || "",
            department: data.department || "",
            batch: data.batch ? data.batch.toString() : "",
            cgpa: data.cgpa ? data.cgpa.toString() : "",
            bio: data.bio || "",
            skills: data.skills && data.skills.length > 0 ? data.skills.join(", ") : ""
          });
        }
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const skillsArray = profile.skills.split(",").map((s) => s.trim()).filter(Boolean);
      await studentAPI.updateProfile({
        bio: profile.bio,
        skills: skillsArray,
        department: profile.department,
        batch: profile.batch,
        rollNumber: profile.rollNumber
      });
      setMessage("Profile saved successfully!");
      setEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const skillList = profile.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <DashboardLayout>
      <div className="profile-page">

        <div className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and academic information.</p>
          </div>

          {message && <span className="profile-msg">{message}</span>}

          {!editing ? (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        <div className="profile-grid">

          <section className="profile-card">
            <h2>Personal Information</h2>

            <div className="profile-info-grid">

              <div>
                <label>Full Name</label>
                <p>{profile.name}</p>
              </div>

              <div>
                <label>Email</label>
                <p>{profile.email}</p>
              </div>

              <div>
                <label>Roll Number</label>
                {editing ? (
                  <input
                    name="rollNumber"
                    value={profile.rollNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.rollNumber || "Not specified"}</p>
                )}
              </div>

              <div>
                <label>Bio / Summary</label>
                {editing ? (
                  <input
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Short bio..."
                  />
                ) : (
                  <p>{profile.bio || "Student at Placement Portal"}</p>
                )}
              </div>

            </div>
          </section>

          <section className="profile-card">
            <h2>Academic Information</h2>

            <div className="profile-info-grid">

              <div>
                <label>Department / Branch</label>
                {editing ? (
                  <input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.department || "Not specified"}</p>
                )}
              </div>

              <div>
                <label>Batch Year</label>
                {editing ? (
                  <input
                    name="batch"
                    value={profile.batch}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.batch || "Not specified"}</p>
                )}
              </div>

              <div>
                <label>CGPA</label>
                <p>{profile.cgpa || "Not specified"}</p>
              </div>

            </div>
          </section>

          <section className="profile-card">
            <h2>Technical Skills</h2>

            {editing ? (
              <div>
                <label>Skills (comma separated)</label>
                <input
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="skills-list">
                {skillList.length > 0 ? (
                  skillList.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))
                ) : (
                  <p>No skills added yet.</p>
                )}
              </div>
            )}
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentProfile;