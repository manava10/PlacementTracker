import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reports from "./pages/TPO/Reports";
import Login from "./pages/Login";
import TPOInterviews from "./pages/TPO/Interviews";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStudents from "./pages/Admin/Students";
import AdminCompanies from "./pages/Admin/Companies";
import AdminPlacementDrives from "./pages/Admin/PlacementDrives";
import AdminInterviews from "./pages/Admin/Interviews";
import AdminReports from "./pages/Admin/Reports";
// ================= STUDENT PAGES =================

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentResume from "./pages/student/StudentResume";
import PlacementDrives from "./pages/student/PlacementDrives";
import Applications from "./pages/student/Applications";
import StudentInterviews from "./pages/student/Interviews";
import AIResumeAnalysis from "./pages/student/AIResumeAnalysis";

// ================= COMPANY PAGES =================

import CompanyDashboard from "./pages/Company/CompanyDashboard";
import CreateDrive from "./pages/Company/CreateDrive";
import CompanyDrives from "./pages/Company/CompanyDrives";
import Applicants from "./pages/Company/Applicants";
import Shortlisted from "./pages/Company/Shortlisted";
import CompanyInterviews from "./pages/Company/Interviews";

// ================= TPO PAGES =================

import TPODashboard from "./pages/TPO/TPODashboard";
import Students from "./pages/TPO/Students";
import Companies from "./pages/TPO/Companies";
import PlacementDrivesTPO from "./pages/TPO/PlacementDrives";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/resume"
          element={<StudentResume />}
        />

        <Route
          path="/student/jobs"
          element={<PlacementDrives />}
        />

        <Route
          path="/student/applications"
          element={<Applications />}
        />

        <Route
          path="/student/interviews"
          element={<StudentInterviews />}
        />

        <Route
          path="/student/ats"
          element={<AIResumeAnalysis />}
        />


        {/* ================= COMPANY ROUTES ================= */}

        <Route
          path="/company"
          element={<CompanyDashboard />}
        />

        <Route
          path="/company/create-drive"
          element={<CreateDrive />}
        />

        <Route
          path="/company/drives"
          element={<CompanyDrives />}
        />

        <Route
          path="/company/applicants"
          element={<Applicants />}
        />

        <Route
          path="/company/shortlisted"
          element={<Shortlisted />}
        />

        <Route
          path="/company/interviews"
          element={<CompanyInterviews />}
        />


        {/* ================= TPO ROUTES ================= */}

        <Route
          path="/tpo"
          element={<TPODashboard />}
        />

        <Route
          path="/tpo/students"
          element={<Students />}
        />

        <Route
          path="/tpo/companies"
          element={<Companies />}
        />

        <Route
          path="/tpo/drives"
          element={<PlacementDrivesTPO />}
        />
        <Route
          path="/tpo/interviews"
          element={<TPOInterviews />}
        />
        <Route
          path="/tpo/reports"
          element={<Reports />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/students"
          element={<AdminStudents />}
        />
        <Route
          path="/admin/companies"
          element={<AdminCompanies />}
        />
        <Route
  path="/admin/drives"
  element={<AdminPlacementDrives />}
/>
        <Route
  path="/admin/interviews"
  element={<AdminInterviews />}
/>
<Route
  path="/admin/reports"
  element={<AdminReports />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;