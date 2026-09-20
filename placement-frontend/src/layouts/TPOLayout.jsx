import TPOSidebar from "../components/TPOSidebar";
import TPONavbar from "../components/TPONavbar";

function TPOLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <TPOSidebar />

      <main className="main-content">

        <TPONavbar />

        <div className="page-content">
          {children}
        </div>

      </main>

    </div>
  );
}

export default TPOLayout;