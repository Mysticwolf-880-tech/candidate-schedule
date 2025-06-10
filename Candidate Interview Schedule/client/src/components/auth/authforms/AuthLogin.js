import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../api";
import { useAuth } from "../../../context/AuthProvider";
import "./AuthLogin.css";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e) => {
    setRememberDevice(e.target.checked);
    if (e.target.checked) setCheckboxError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCheckboxError("");

    if (!rememberDevice) {
      setCheckboxError("You must accept to remember this device.");
      return;
    }

    setLoading(true);
    setDisableSubmit(true);

    try {
      const response = await api.post("/login", formData, {
        withCredentials: true,
      });

      login(response.data.token);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      setDisableSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="auth-login">
      {error && (
        <div style={{ background: "red", color: "white", padding: "10px" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "green", color: "white", padding: "10px" }}>
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group relative">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="form-check">
          <input
            id="accept"
            type="checkbox"
            checked={rememberDevice}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="accept">Remember this Device</label>
        </div>
        {checkboxError && <p className="error-message">{checkboxError}</p>}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || disableSubmit}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AuthLogin;
