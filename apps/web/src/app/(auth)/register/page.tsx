"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get("fullName");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, confirmPassword, fullName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            alert("Registration successful! Please log in.");
            window.location.href = "/login";
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
                <h2>Create Account</h2>
                <p>Join the platform for seamless, fraud-resistant events.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Jane Doe"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Create a password"
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

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            required
                        />
                        <button
                            type="button"
                            className="visibility-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading} title="Create your account">
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <div className="auth-footer">
                Already have an account? <Link href="/login" title="Sign In to your account">Log In</Link>
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
