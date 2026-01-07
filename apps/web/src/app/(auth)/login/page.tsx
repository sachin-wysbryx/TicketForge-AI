"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const response = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Handle successful login (e.g., save token, redirect)
            localStorage.setItem("accessToken", data.accessToken);
            alert("Login successful!");
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-header">
                <div className="logo-container">
                    <div className="logo-icon">🎴</div>
                    <span className="logo-text">TicketForge AI</span>
                </div>
                <h2>Organizer Dashboard</h2>
                <p>Manage your events securely with real-time fraud protection.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <label htmlFor="email">Email or Username</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-label-row">
                        <label htmlFor="password">Password</label>
                        <Link href="/forgot-password" title="Recover your password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="visibility-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading} title="Sign In to your account">
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>

            <div className="auth-footer">
                Don't have an account? <Link href="/register" title="Create a new account">Sign Up</Link>
            </div>

            <div className="security-badges">
                <div className="badge">
                    <span>🔒</span> BLOCKCHAIN SECURED
                </div>
                <div className="badge">
                    <span>🛡️</span> AI PROTECTED
                </div>
            </div>
        </div>
    );
}
