import React from "react";
import "./auth.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-container">
            <div className="auth-left">
                {children}
            </div>
            <div className="auth-right">
                <div className="auth-right-content">
                    <div className="platform-tag">
                        <span className="dot"></span> Platform Online
                    </div>
                    <h1>
                        Fraud-proof ticketing. <br />
                        <span className="accent-text">Dynamic experiences.</span>
                    </h1>
                    <p>
                        Our AI-driven distributed ledger ensures every ticket is authentic,
                        personalized, and secure.
                    </p>
                </div>
            </div>
        </div>
    );
}
