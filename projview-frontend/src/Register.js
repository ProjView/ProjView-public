import React, { useState } from "react";
import './Register.css';
import { BASE_URL } from "./authConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Register = ({ setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);  // Reset error on submit
    setLoading(true); // Show loading spinner

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json(); // Get the response data
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setIsLogin(true), 2000); // Redirect to login after success
      } else {
        console.log("Registration error:", data);
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
    }
    
    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="RegisterModal">
      <div className="RegisterModal-content">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          
          {success ? (
            <p className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
              Registration successful! Redirecting...
            </p>
          ) : (
            <button type="submit" disabled={loading}>
              {loading && <span className="spinner"><FontAwesomeIcon icon={faCircleNotch} spin /></span>}
              Register
            </button>
          )}
        </form>
        <p onClick={() => setIsLogin(true)}>
          Already have an account? <span className="login-link">Log in here.</span>
        </p>
      </div>
    </div>
  );
};

export default Register;

