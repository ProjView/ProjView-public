import React, { useState, useEffect } from "react";
import './Login.css';
import { BASE_URL } from "./authConfig";

const Login = ({ onLogin, setIsLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const tokenExpiration = localStorage.getItem("tokenExpiration");

        if (token && tokenExpiration) {
            const currentTime = new Date().getTime();

            if (currentTime < tokenExpiration) {
                // Token is still valid, auto-login the user
                onLogin(token, username);
            } else {
                // Token has expired, clear the stored token
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiration");
            }
        }
    }, []); 

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/login/isTokenValid`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isValid) {
                    // Token is valid, proceed with login
                    onLogin(localStorage.getItem("token"), username);
                    return;
                }
            }

            // Token is invalid or request failed, proceed with regular login
            const loginResponse = await fetch(`${BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                const token = loginData.token;
                const refreshToken = loginData.refreshToken;
                const expirationTime = new Date().getTime() + 60 * 60 * 1000;
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("tokenExpiration", expirationTime);
                localStorage.setItem("userName", username); // Store the username

                onLogin(token, username);
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div className="LoginModal">
            <div className="LoginModal-content">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <p onClick={() => setIsLogin(false)}>
                    Don't have an account? <span className="login-link">Register here.</span>
                </p> 
            </div>
        </div>
    );
};

export default Login;
