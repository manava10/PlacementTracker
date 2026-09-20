import CompanySidebar from "../components/CompanySidebar";
import CompanyNavbar from "../components/CompanyNavbar";

function CompanyLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <CompanySidebar />

      <main className="main-content">
        <CompanyNavbar />

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default CompanyLayout;