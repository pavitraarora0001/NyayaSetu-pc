
// app/police/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
    AlertTriangle,
    Clock,
    Calendar,
    Eye,
    FileText,
    Search,
    Trash2,
    History as HistoryIcon,
    LayoutDashboard as LayoutDashboardIcon
} from 'lucide-react';

// Mock Data removed in favor of API
// const MOCK_INCIDENTS = ...

export default function PoliceDashboard() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [showHidden, setShowHidden] = useState(false);

    const fetchIncidents = async () => {
        try {
            const res = await fetch('/api/incidents');
            if (res.ok) {
                const data = await res.json();
                setIncidents(data);
            }
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        }
    };

    useEffect(() => {
        fetchIncidents();
        // Live polling every 3 seconds
        const interval = setInterval(fetchIncidents, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this incident from the dashboard? It will be moved to history.")) return;

        try {
            const res = await fetch('/api/incidents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, hidden: true })
            });

            if (res.ok) {
                fetchIncidents(); // Refresh
            }
        } catch (error) {
            console.error("Failed to delete incident", error);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const res = await fetch('/api/incidents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, hidden: false })
            });

            if (res.ok) {
                fetchIncidents(); // Refresh
            }
        } catch (error) {
            console.error("Failed to restore incident", error);
        }
    };

    // Stats Calculation
    const pendingCount = incidents.filter(i => (i.status === 'New' || i.status === 'Pending Review') && !i.hidden).length;
    const firCount = incidents.filter(i => (i.status === 'FIR Filed' || i.status === 'FIR Drafted') && !i.hidden).length;
    const totalCount = incidents.filter(i => !i.hidden).length;

    const displayedIncidents = incidents.filter(i => showHidden ? i.hidden : !i.hidden);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '2rem 1rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ color: 'var(--color-navy)', fontSize: '2rem', margin: 0 }}>Officer Dashboard</h1>
                            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                                {showHidden ? 'Viewing Deleted Incidents (History)' : 'Viewing Active Incidents'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowHidden(!showHidden)}
                                className="btn btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {showHidden ? <><LayoutDashboardIcon size={18} /> Active View</> : <><HistoryIcon size={18} /> View History</>}
                            </button>
                            <Link href="/police/create" style={{ textDecoration: 'none' }}>
                                <div className="btn btn-primary">
                                    + New Manual Entry
                                </div>
                            </Link>
                        </div>
                    </div>

                    {!showHidden && (
                        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: '3rem' }}>
                            {/* Stats Cards */}
                            <div className="card" style={{ borderLeft: '4px solid var(--status-warning)' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Pending Review</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-navy)' }}>{pendingCount}</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--status-success)' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>FIRs Filed Today</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-navy)' }}>{firCount}</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--status-info)' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Active Cases</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-navy)' }}>{totalCount}</p>
                            </div>
                        </div>
                    )}

                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--color-navy)' }}>
                        {showHidden ? 'Incident History (Deleted)' : 'Recent Active Incidents'}
                    </h2>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f0f0f5', borderBottom: '1px solid #ddd' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Location</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedIncidents.length > 0 ? displayedIncidents.map((inc) => (
                                    <tr key={inc.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{inc.id}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{inc.date}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                padding: '0.25rem 0.75rem', borderRadius: '12px',
                                                backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '0.85rem'
                                            }}>
                                                <AlertTriangle size={14} /> {inc.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{inc.location}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500,
                                                backgroundColor: inc.status === 'New' ? '#fee2e2' : '#d1fae5',
                                                color: inc.status === 'New' ? '#b91c1c' : '#047857'
                                            }}>
                                                {inc.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <a href={`/police/incident/${inc.id}`} style={{ textDecoration: 'none' }}>
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                                        <Eye size={16} /> Review
                                                    </button>
                                                </a>
                                                {!showHidden ? (
                                                    <button
                                                        onClick={() => handleDelete(inc.id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem', color: '#dc2626', borderColor: '#fee2e2' }}
                                                        title="Delete Incident"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRestore(inc.id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#059669' }}
                                                    >
                                                        Restore
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            {showHidden ? 'No deleted incidents found.' : 'No active incidents found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
