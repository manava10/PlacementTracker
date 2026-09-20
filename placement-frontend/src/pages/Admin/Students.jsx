import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminAPI } from "../../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    adminAPI.getStudents()
      .then((res) => setStudents(res.data || []))
      .catch((err) => console.error("Error loading students:", err));
  }, []);

  const formattedStudents = students.map((s) => ({
    id: s._id,
    name: s.userId?.name || 'Student Candidate',
    email: s.userId?.email || 'N/A',
    branch: s.department || 'N/A',
    year: s.batch ? `${s.batch} Batch` : 'N/A',
    cgpa: s.cgpa != null ? s.cgpa.toString() : 'N/A',
    cgpaValue: Number(s.cgpa) || 0,
    company: s.placedCompany?.companyName || '-',
    status: s.isPlaced ? "Placed" : "Unplaced"
  }));

  const filteredStudents = formattedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.branch.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const placed = formattedStudents.filter((student) => student.status === "Placed").length;
  const unplaced = formattedStudents.filter((student) => student.status === "Unplaced").length;
  const averageCGPA = formattedStudents.length > 0
    ? formattedStudents.reduce((sum, s) => sum + s.cgpaValue, 0) / formattedStudents.length
    : 0;

  return (
    <AdminLayout>

      {/* Header */}

      <div className="company-heading">
        <div>
          <h1>Students</h1>
          <p>
            Manage all students registered in the placement portal.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="company-stats">

        <div className="company-stat-card">
          <h3>Total Students</h3>
          <strong>{formattedStudents.length}</strong>
          <p>Registered students</p>
        </div>

        <div className="company-stat-card">
          <h3>Placed</h3>
          <strong>{placed}</strong>
          <p>Successfully placed</p>
        </div>

        <div className="company-stat-card">
          <h3>Average CGPA</h3>
          <strong>{averageCGPA.toFixed(2)}</strong>
          <p>Overall average</p>
        </div>

        <div className="company-stat-card">
          <h3>Unplaced</h3>
          <strong>{unplaced}</strong>
          <p>Currently unplaced</p>
        </div>

      </div>

      {/* Student Table */}

      <div className="company-section">

        <div className="student-toolbar">

          <div>
            <h2>Student Management</h2>
            <p>
              Search and manage registered students.
            </p>
          </div>

          <div className="student-filters">

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
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
                <th>Branch</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Company</th>
                <th>Status</th>
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

                  <td>{student.branch}</td>

                  <td>{student.year}</td>

                  <td>
                    <strong>{student.cgpa}</strong>
                  </td>

                  <td>{student.company}</td>

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

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Name: ${student.name}\nEmail: ${student.email}\nBranch: ${student.branch}\nBatch: ${student.year}\nCGPA: ${student.cgpa}\nStatus: ${student.status}`
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

    </AdminLayout>
  );
}

export default Students;