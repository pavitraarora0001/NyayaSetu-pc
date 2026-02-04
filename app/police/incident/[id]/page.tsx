
// app/police/incident/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { analyzeIncident, AnalysisResult } from '@/lib/ai-logic';
import { ArrowLeft, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock DB Removed
// const INCIDENT_DB = ...

export default function IncidentDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [incidentData, setIncidentData] = useState<any>(null); // Store fetched incident
    const [status, setStatus] = useState('Pending Review');

    useEffect(() => {
        // Fetch specific incident from API (Simulated by filtering all)
        const fetchIncident = async () => {
            try {
                const res = await fetch('/api/incidents');
                if (res.ok) {
                    const allIncidents = await res.json();
                    const found = allIncidents.find((i: any) => i.id === id);

                    if (found) {
                        setIncidentData(found);
                        // If stored analysis exists, use it, otherwise re-analyze (backup)
                        if (found.analysis && found.analysis.sections) {
                            setAnalysis(found.analysis);
                        } else {
                            // Fallback to re-analysis if data missing
                            const result = analyzeIncident(found.description);
                            setAnalysis(result);
                        }
                        setStatus(found.status || 'Pending Review');
                    }
                }
            } catch (err) {
                console.error("Failed to load incident", err);
            }
        };

        fetchIncident();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setStatus(newStatus); // Optimistic update
            await fetch('/api/incidents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (!incidentData) {
        return <div className="p-8">Loading Incident...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '2rem 1rem' }}>
                <div className="container">
                    <Link href="/police" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-navy)', fontWeight: 500 }}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>

                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                        {/* Left Column: Incident Details */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Incident #{id}</h2>
                                <span style={{
                                    background: status === 'FIR Filed' ? '#dcfce7' : '#fef3c7',
                                    color: status === 'FIR Filed' ? '#166534' : '#d97706',
                                    padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600
                                }}>
                                    {status}
                                </span>
                            </div>

                            {/* New Metadata Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Date</label>
                                    <span style={{ fontWeight: 500 }}>{incidentData.date}</span>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Time</label>
                                    <span style={{ fontWeight: 500 }}>{incidentData.time}</span>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Location</label>
                                    <span style={{ fontWeight: 500 }}>{incidentData.location}</span>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Type</label>
                                    <span style={{ fontWeight: 500 }}>{incidentData.type}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="label">Original Complaint</label>
                                <p style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', lineHeight: 1.6 }}>
                                    "{incidentData.description}"
                                </p>
                            </div>
                            <div>
                                <label className="label">Evidence</label>
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No media attached.</p>
                            </div>
                        </div>

                        {/* Right Column: AI Analysis */}
                        <div className="card" style={{ borderTop: '4px solid var(--color-navy)' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} /> AI Legal Analysis
                            </h2>

                            {analysis ? (
                                <>
                                    <div className="mb-4">
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Identified Codes</h3>
                                        {analysis.sections.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {analysis.sections.map((sec, i) => (
                                                    <li key={i} style={{
                                                        background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e40af' }}>
                                                            <span>{sec.section}</span>
                                                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{sec.ipc_section}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.9rem' }}>{sec.description}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                                                            {sec.cognizable ? <span style={{ color: '#dc2626', fontWeight: 600 }}>Cognizable</span> : 'Non-Cognizable'} • {sec.bailable ? 'Bailable' : 'Non-Bailable'}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: 'red' }}>No clear sections identified.</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>AI Recommendation</h3>
                                        <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                                            {analysis.riskLevel === 'High' ? 'This is a high-priority case.' : 'Standard priority.'} {analysis.guidance[1]}
                                        </p>
                                    </div>

                                    {status === 'FIR Filed' ? (
                                        <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                                            <CheckCircle size={24} style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                                            <p>Case Filed Successfully</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <button className="btn btn-primary" onClick={() => handleStatusUpdate('FIR Drafted')}>
                                                Generate FIR Draft (Preview)
                                            </button>

                                            <button
                                                className="btn btn-primary"
                                                style={{ backgroundColor: '#059669', display: status === 'FIR Drafted' ? 'flex' : 'none', justifyContent: 'center' }}
                                                onClick={() => handleStatusUpdate('FIR Filed')}
                                            >
                                                <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Accept & File Official FIR
                                            </button>

                                            <button className="btn btn-secondary" onClick={() => handleStatusUpdate('Rejected')}>
                                                Reject / Ask for Info
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>Analyzing...</p>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
