import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminAPI } from "../../services/api";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    adminAPI.getCompanies()
      .then((res) => setCompanies(res.data || []))
      .catch((err) => console.error("Error loading companies:", err));
  }, []);

  const formattedCompanies = companies.map((c) => ({
    id: c._id,
    name: c.companyName || c.userId?.name || 'Recruiting Company',
    email: c.hrEmail || c.userId?.email || 'N/A',
    industry: c.industry || 'N/A',
    location: c.location || 'N/A',
    drives: c.totalPositions || 0,
    applicants: c.filledPositions || 0,
    status: c.isVerified ? "Verified" : "Pending"
  }));

  const filteredCompanies = formattedCompanies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.industry.toLowerCase().includes(search.toLowerCase()) ||
      company.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      company.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const active = formattedCompanies.filter((company) => company.status === "Verified").length;
  const pending = formattedCompanies.filter((company) => company.status === "Pending").length;
  const totalPositions = formattedCompanies.reduce((sum, company) => sum + company.drives, 0);

  return (
    <AdminLayout>

      {/* Header */}

      <div className="company-heading">

        <div>
          <h1>Companies</h1>
          <p>
            Manage companies registered in the placement portal.
          </p>
        </div>

      </div>

      {/* Statistics */}

      <div className="company-stats">

        <div className="company-stat-card">
          <h3>Total Companies</h3>
          <strong>{formattedCompanies.length}</strong>
          <p>Registered companies</p>
        </div>

        <div className="company-stat-card">
          <h3>Verified</h3>
          <strong>{active}</strong>
          <p>Approved recruiters</p>
        </div>

        <div className="company-stat-card">
          <h3>Pending</h3>
          <strong>{pending}</strong>
          <p>Awaiting verification</p>
        </div>

        <div className="company-stat-card">
          <h3>Total Positions</h3>
          <strong>{totalPositions}</strong>
          <p>Total job openings</p>
        </div>

      </div>

      {/* Company Table */}

      <div className="company-section">

        <div className="student-toolbar">

          <div>
            <h2>Company Management</h2>
            <p>
              Search and manage registered companies.
            </p>
          </div>

          <div className="student-filters">

            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>

          </div>

        </div>

        <div className="student-table-wrapper">

          <table className="student-table">

            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Location</th>
                <th>HR Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCompanies.map((company) => (

                <tr key={company.id}>

                  <td>
                    <div className="student-name">
                      <strong>{company.name}</strong>
                      <span>{company.email}</span>
                    </div>
                  </td>

                  <td>{company.industry}</td>

                  <td>{company.location}</td>

                  <td>{company.email}</td>

                  <td>

                    <span
                      className={
                        company.status === "Verified"
                          ? "status-badge active"
                          : "status-badge unplaced"
                      }
                    >
                      {company.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Company: ${company.name}\nEmail: ${company.email}\nIndustry: ${company.industry}\nLocation: ${company.location}\nStatus: ${company.status}`
                        )
                      }
                    >
                      View Details
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredCompanies.length === 0 && (
            <div className="no-students">
              No companies found.
            </div>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default Companies;