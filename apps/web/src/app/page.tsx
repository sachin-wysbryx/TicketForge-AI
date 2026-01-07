"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirect to the premium login page by default
  }, [router]);

  return (
    <div style={{
      background: "#0d0d15",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "var(--font-inter), sans-serif"
    }}>
      <div className="logo-container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "#6366f1",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px"
        }}>🎴</div>
        <span style={{ fontSize: "32px", fontWeight: "700" }}>TicketForge AI</span>
      </div>
    </div>
  );
}
