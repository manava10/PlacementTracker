import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;