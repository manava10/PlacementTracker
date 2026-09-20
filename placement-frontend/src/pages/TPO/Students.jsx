import { useEffect, useState } from "react";
import TPOLayout from "../../layouts/TPOLayout";
import { tpoAPI } from "../../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    tpoAPI.getStudents()
      .then((res) => setStudents(res.data || []))
      .catch((err) => console.error("Error loading TPO students:", err));
  }, []);

  const formattedStudents = students.map((s) => ({
    id: s._id,
    name: s.userId?.name || 'Student Candidate',
    email: s.userId?.email || 'N/A',
    course: s.department || 'N/A',
    year: s.batch ? `${s.batch} Batch` : 'N/A',
    cgpa: s.cgpa != null ? s.cgpa : 'N/A',
    cgpaValue: Number(s.cgpa) || 0,
    status: s.isPlaced ? "Placed" : "Unplaced",
    company: s.placedCompany?.companyName || '-',
    package: s.salary ? `₹${(s.salary / 100000).toFixed(1)} LPA` : '-'
  }));

  const filteredStudents = formattedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalStudents = formattedStudents.length;
  const placedStudents = formattedStudents.filter((student) => student.status === "Placed").length;
  const unplacedStudents = formattedStudents.filter((student) => student.status === "Unplaced").length;

  const averageCGPA = totalStudents > 0
    ? formattedStudents.reduce((sum, student) => sum + student.cgpaValue, 0) / totalStudents
    : 0;

  return (
    <TPOLayout>

      <div className="company-heading">

        <div>
          <h1>Students</h1>
          <p>Manage and monitor student placement information.</p>
        </div>

      </div>

      {/* Statistics */}

      <div className="company-stats">

        <div className="company-stat-card">
          <h3>Total Students</h3>
          <strong>{totalStudents}</strong>
          <p>Registered students</p>
        </div>

        <div className="company-stat-card">
          <h3>Placed Students</h3>
          <strong>{placedStudents}</strong>
          <p>Successfully placed</p>
        </div>

        <div className="company-stat-card">
          <h3>Unplaced Students</h3>
          <strong>{unplacedStudents}</strong>
          <p>Looking for opportunities</p>
        </div>

        <div className="company-stat-card">
          <h3>Average CGPA</h3>
          <strong>{averageCGPA.toFixed(2)}</strong>
          <p>Overall average</p>
        </div>

      </div>

      {/* Student List */}

      <div className="company-section">

        <div className="student-toolbar">

          <div>
            <h2>Student List</h2>
            <p>View and manage registered students.</p>
          </div>

          <div className="student-filters">

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Students</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
            </select>

          </div>

        </div>

        <div className="student-table-wrapper">

          <table className="student-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Company</th>
                <th>Package</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student) => (

                <tr key={student.id}>

                  <td>
                    <div className="student-name">
                      <strong>{student.name}</strong>
                      <span>{student.email}</span>
                    </div>
                  </td>

                  <td>{student.course}</td>

                  <td>{student.year}</td>

                  <td>
                    <strong>{student.cgpa}</strong>
                  </td>

                  <td>
                    <span
                      className={
                        student.status === "Placed"
                          ? "status-badge placed"
                          : "status-badge unplaced"
                      }
                    >
                      {student.status}
                    </span>
                  </td>

                  <td>{student.company}</td>

                  <td>{student.package}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Student: ${student.name}\nEmail: ${student.email}\nCGPA: ${student.cgpa}`
                        )
                      }
                    >
                      View Profile
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredStudents.length === 0 && (
            <div className="no-students">
              No students found.
            </div>
          )}

        </div>

      </div>

    </TPOLayout>
  );
}

export default Students;