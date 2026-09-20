import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

function AdminLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <AdminSidebar />

      <main className="main-content">

        <AdminNavbar />

        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;