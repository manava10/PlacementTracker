import { useEffect, useState } from "react";
import TPOLayout from "../../layouts/TPOLayout";
import { tpoAPI } from "../../services/api";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    tpoAPI.getCompanies()
      .then((res) => setCompanies(res.data || []))
      .catch((err) => console.error("Error loading TPO companies:", err));
  }, []);

  const formattedCompanies = companies.map((c) => ({
    id: c._id,
    name: c.companyName || c.userId?.name || 'Recruiting Partner',
    email: c.hrEmail || c.userId?.email || 'N/A',
    industry: c.industry || 'N/A',
    location: c.location || 'N/A',
    drives: c.totalPositions || 0,
    applicants: c.filledPositions || 0,
    status: c.isVerified ? "Verified" : "Pending"
  }));

  const filteredCompanies = formattedCompanies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.industry.toLowerCase().includes(search.toLowerCase()) ||
    company.location.toLowerCase().includes(search.toLowerCase())
  );

  const activeCompanies = formattedCompanies.filter((company) => company.status === "Verified").length;
  const totalDrives = formattedCompanies.reduce((sum, company) => sum + company.drives, 0);

  return (
    <TPOLayout>

      <div className="company-heading">

        <div>
          <h1>Companies</h1>
          <p>Manage companies participating in campus placements.</p>
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
          <h3>Verified Companies</h3>
          <strong>{activeCompanies}</strong>
          <p>Approved recruiters</p>
        </div>

        <div className="company-stat-card">
          <h3>Total Positions</h3>
          <strong>{totalDrives}</strong>
          <p>Job openings</p>
        </div>

        <div className="company-stat-card">
          <h3>Verified Rate</h3>
          <strong>{formattedCompanies.length > 0 ? ((activeCompanies / formattedCompanies.length) * 100).toFixed(0) : 0}%</strong>
          <p>Verification ratio</p>
        </div>

      </div>

      {/* Company List */}

      <div className="company-section">

        <div className="student-toolbar">

          <div>
            <h2>Company List</h2>
            <p>View companies and their placement activities.</p>
          </div>

          <div className="student-filters">

            <input
              type="text"
              placeholder="Search company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

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

                  <td>
                    <strong>{company.email}</strong>
                  </td>

                  <td>
                    <span
                      className={
                        company.status === "Verified"
                          ? "status-badge placed"
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
                          `Company: ${company.name}\nEmail: ${company.email}\nIndustry: ${company.industry}\nLocation: ${company.location}`
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

    </TPOLayout>
  );
}

export default Companies;