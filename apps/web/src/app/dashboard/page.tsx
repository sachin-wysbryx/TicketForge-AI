"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./dashboard.css";
import { useRouter } from "next/navigation";

interface DashboardData {
    user: { fullName: string; role: string };
    stats: { attended: number; points: number };
    nextEvent: any;
    recommendedEvents: any[];
    unreadNotifications: number;
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("Home");
    const [data, setData] = useState<DashboardData | null>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const fetchDashboard = useCallback(async (search = "") => {
        const token = localStorage.getItem("accessToken");
        if (!token) return router.push("/login");

        try {
            const url = `http://localhost:4000/api/dashboard${search ? `?search=${search}` : ""}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch dashboard");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchTickets = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:4000/api/dashboard/my-tickets", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setTickets(json);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        if (activeTab === "My Tickets") {
            fetchTickets();
        }
    }, [activeTab, fetchTickets]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        // Real search (debounced ideally, but direct for now)
        fetchDashboard(val);
    };

    const toggleFavorite = async (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation();
        const token = localStorage.getItem("accessToken");
        await fetch(`http://localhost:4000/api/dashboard/favorite/${eventId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchDashboard(searchQuery);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        router.push("/login");
    };

    if (loading) return <div className="loading">Initializing TicketForge AI...</div>;
    if (!data) return null;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">TF</div>
                    <span className="logo-text">TicketForge</span>
                </div>

                <nav className="nav-links">
                    {[
                        { name: "Home", icon: "🏠" },
                        { name: "My Tickets", icon: "🎟️" },
                        { name: "Explore", icon: "🔭" },
                        { name: "Favorites", icon: "❤️" },
                        { name: "Settings", icon: "⚙️" },
                    ].map((tab) => (
                        <div
                            key={tab.name}
                            className={`nav-item ${activeTab === tab.name ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            <span>{tab.icon}</span> <span>{tab.name}</span>
                        </div>
                    ))}
                    <div className="nav-item logout-nav" onClick={handleLogout}>
                        <span>🚪</span> <span>Logout</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="verified-card">
                        <div className="verified-badge">🛡️ VERIFIED</div>
                        <p>Your account is fully protected with our anti-fraud technology.</p>
                    </div>
                    <button className="help-btn">Need Help?</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search events, artists, venues..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="user-actions">
                        <div className="notification-bell">
                            🔔
                            {data.unreadNotifications > 0 && (
                                <span className="notification-dot"></span>
                            )}
                        </div>
                        <div className="user-profile" onClick={() => setActiveTab("Settings")}>
                            <div className="avatar"></div>
                            <span className="user-name">{data.user.fullName}</span>
                            <span>⌄</span>
                        </div>
                    </div>
                </header>

                {activeTab === "Home" && (
                    <>
                        <section className="welcome-section">
                            <div>
                                <h1>Welcome back, {data.user.fullName.split(" ")[0]} 👋</h1>
                                <p>You have <span className="accent">{tickets.filter(t => new Date(t.event_date) > new Date()).length || 3} upcoming events</span> this month.</p>
                            </div>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-label">Attended</div>
                                    <div className="stat-value">{data.stats.attended}</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Points</div>
                                    <div className="stat-value">{data.stats.points.toLocaleString()}</div>
                                </div>
                            </div>
                        </section>

                        {data.nextEvent ? (
                            <>
                                <div className="section-title">
                                    <span>📅 Your Next Event</span>
                                </div>
                                <div className="featured-card">
                                    <div
                                        className="featured-img"
                                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000')` }}
                                    >
                                        <div className="status-badge">Confirmed</div>
                                    </div>
                                    <div className="featured-details">
                                        <div className="event-meta">
                                            {new Date(data.nextEvent.event_date).toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <h2>{data.nextEvent.title}</h2>
                                        <div className="event-info">
                                            <span>📍 {data.nextEvent.venue}</span>
                                            <span>🎟️ Sec 102, Row B</span>
                                        </div>
                                        <div className="event-actions">
                                            <button className="btn-primary" onClick={() => alert("Opening Ticket QR...")}>📱 View Ticket</button>
                                            <button className="btn-secondary">Manage Booking</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <div className="section-title">
                            <span>✨ {searchQuery ? "Search Results" : "Curated For You"}</span>
                            <span className="see-all" onClick={() => setActiveTab("Explore")}>See All</span>
                        </div>

                        <div className="event-grid">
                            {data.recommendedEvents.map((event, i) => (
                                <div key={event.id} className="event-card">
                                    <div
                                        className="card-img"
                                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-${1500000000000 + (event.title.length * 100)}?auto=format&fit=crop&q=60&w=500')` }}
                                    >
                                        <div
                                            className="card-favorite"
                                            onClick={(e) => toggleFavorite(e, event.id)}
                                            style={{ color: event.is_favorite ? "#ef4444" : "white" }}
                                        >
                                            {event.is_favorite ? "❤️" : "🤍"}
                                        </div>
                                        <div className="card-tag">Trending Now</div>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-date">{new Date(event.event_date).toDateString()}</div>
                                        <h3>{event.title}</h3>
                                        <div className="card-location">{event.venue}</div>
                                        <div className="card-footer">
                                            <div className="card-price">From ${event.base_price} <span>/person</span></div>
                                            <div className="get-tickets" onClick={() => alert(`Redirecting to ${event.title} booking...`)}>Get Tickets →</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.recommendedEvents.length === 0 && (
                                <div className="no-events">No events found matching "{searchQuery}"</div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "My Tickets" && (
                    <div className="tickets-view">
                        <h1>My Tickets</h1>
                        {tickets.length > 0 ? (
                            <div className="tickets-list">
                                {tickets.map((t) => (
                                    <div key={t.booking_id} className="ticket-item">
                                        <div className="ticket-info">
                                            <h3>{t.title}</h3>
                                            <p>📍 {t.venue}</p>
                                            <p>📅 {new Date(t.event_date).toLocaleString()}</p>
                                        </div>
                                        <div className="ticket-status">
                                            <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span>
                                            <button className="btn-secondary small" onClick={() => alert(`Details for booking ${t.booking_id}`)}>View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">You haven't booked any events yet.</div>
                        )}
                    </div>
                )}

                {(activeTab === "Explore" || activeTab === "Favorites" || activeTab === "Settings") && (
                    <div className="placeholder-view">
                        <h1>{activeTab}</h1>
                        <div className="no-events">This module is currently being optimized for TicketForge AI. Stay tuned!</div>
                    </div>
                )}
            </main>
        </div>
    );
}
