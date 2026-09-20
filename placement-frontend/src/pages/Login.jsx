import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { authAPI } from "../services/api";

function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [registerData, setRegisterData] = useState({
    name: "",
    rollNumber: "",
    department: "",
    batch: "",
    companyName: "",
    hrName: "",
    hrEmail: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      
      // Navigate based on role
      const roleRoute = userData.role.toLowerCase();
      navigate(`/${roleRoute}`);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const updateRegisterData = (field, value) => {
    setRegisterData((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== registerData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const additionalData = role === "student"
        ? { rollNumber: registerData.rollNumber, department: registerData.department, batch: registerData.batch }
        : { companyName: registerData.companyName, hrName: registerData.hrName, hrEmail: registerData.hrEmail };
      const userData = await register(registerData.name, email, password, role, additionalData);
      navigate(`/${userData.role}`);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.data.message || "If an account exists, reset instructions will be sent.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Unable to contact the server. Please try again.");
    }
  };

  return (
    <div className="professional-login">

      {/* LEFT SECTION */}
      <div className="login-brand-section">

        <div className="brand-content">

          <div className="brand-logo">
            PP
          </div>

          <h1>Placement Portal</h1>

          <p className="brand-tagline">
            AI-Powered Placement Management System
          </p>

          <p className="brand-description">
            Connecting students, companies and placement teams
            through one intelligent platform.
          </p>

          <div className="brand-features">

            <div className="brand-feature">
              <span>✓</span>
              <p>Manage placement opportunities</p>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <p>Track applications and interviews</p>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <p>AI-powered resume analysis</p>
            </div>

          </div>

        </div>

        <div className="brand-footer">
          © 2026 Placement Portal
        </div>

      </div>


      {/* RIGHT LOGIN SECTION */}
      <div className="login-form-section">

        <div className="login-card-modern">

          <div className="login-header">

            <h2>{mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}</h2>

            <p>
              {mode === "login" && "Sign in to continue to your placement dashboard"}
              {mode === "register" && "Create your placement portal account"}
              {mode === "forgot" && "Enter your email to request password reset instructions"}
            </p>

          </div>

          {(error || message) && <p className="login-error">{error || message}</p>}

          {mode === "login" && <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <div className="form-group">

              <div className="password-label">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => { setMode("forgot"); setMessage(""); }}
                >
                  Forgot Password?
                </button>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            <div className="form-group">

              <label>Login As</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >

                <option value="student">Student</option>
                <option value="company">Company</option>
                <option value="tpo">TPO</option>
                <option value="admin">Admin</option>

              </select>

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>}

          {mode === "forgot" && <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="login-button" disabled={loading}>Request Reset</button>
          </form>}

          {mode === "register" && <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={registerData.name} onChange={(e) => updateRegisterData("name", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="company">Company</option>
              </select>
            </div>
            {role === "student" ? <>
              <div className="form-group"><label>Roll Number</label><input value={registerData.rollNumber} onChange={(e) => updateRegisterData("rollNumber", e.target.value)} required /></div>
              <div className="form-group"><label>Department</label><input value={registerData.department} onChange={(e) => updateRegisterData("department", e.target.value)} required /></div>
              <div className="form-group"><label>Batch Year</label><input value={registerData.batch} onChange={(e) => updateRegisterData("batch", e.target.value)} required /></div>
            </> : <>
              <div className="form-group"><label>Company Name</label><input value={registerData.companyName} onChange={(e) => updateRegisterData("companyName", e.target.value)} required /></div>
              <div className="form-group"><label>HR Name</label><input value={registerData.hrName} onChange={(e) => updateRegisterData("hrName", e.target.value)} required /></div>
              <div className="form-group"><label>HR Email</label><input type="email" value={registerData.hrEmail} onChange={(e) => updateRegisterData("hrEmail", e.target.value)} required /></div>
            </>}
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required /></div>
            <div className="form-group"><label>Confirm Password</label><input type="password" value={registerData.confirmPassword} onChange={(e) => updateRegisterData("confirmPassword", e.target.value)} minLength="6" required /></div>
            <button type="submit" className="login-button" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</button>
          </form>}


          <div className="login-caption">

              <span>{mode === "login" ? "New to Placement Portal?" : "Already have an account?"}</span>

            <button
              type="button"
              className="register-link"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>

          </div>

          {mode === "forgot" && <button type="button" className="register-link" onClick={() => { setMode("login"); setMessage(""); }}>Back to sign in</button>}


          <p className="security-caption">
            🔒 Your account information is protected and secure.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;