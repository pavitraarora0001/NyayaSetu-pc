
// app/police/incident/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { analyzeIncident, AnalysisResult, generateFormalFIR } from '@/lib/ai-logic';
import { ArrowLeft, CheckCircle, FileText, AlertTriangle, Sparkles, XCircle } from 'lucide-react';
import Link from 'next/link';

// Mock DB Removed
// const INCIDENT_DB = ...

export default function IncidentDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [incidentData, setIncidentData] = useState<any>(null); // Store fetched incident
    const [status, setStatus] = useState('Pending Review');
    const [isEditingFIR, setIsEditingFIR] = useState(false);
    const [firForm, setFirForm] = useState({
        complainantName: '',
        complainantPhone: '',
        complainantAddress: '',
        placeOfOccurrence: '',
        distanceFromStation: '',
        narrative: ''
    });

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

                        // Initialize FIR Form if data exists
                        if (found.firData) {
                            setFirForm(found.firData);
                        } else {
                            setFirForm(prev => ({ ...prev, narrative: found.description }));
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load incident", err);
            }
        };

        fetchIncident();
    }, [id]);

    const handleSaveFIR = async () => {
        try {
            const resp = await fetch('/api/incidents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    firData: firForm
                })
            });

            if (resp.ok) {
                setIsEditingFIR(false);
                setIncidentData({ ...incidentData, firData: firForm });
            }
        } catch (error) {
            console.error("Failed to save FIR", error);
        }
    };

    const handleAIGenerate = (customForm?: any) => {
        if (!incidentData || !analysis) return "";
        const targetForm = customForm || firForm;
        const formalized = generateFormalFIR(incidentData.description, analysis.sections, targetForm);
        setFirForm(prev => ({ ...prev, narrative: formalized }));
        return formalized;
    };

    const handleProceedToFIR = async () => {
        if (!incidentData) return;

        // 1. Prepare form data with existing incident info if any
        const initialForm = {
            ...firForm,
            placeOfOccurrence: incidentData.location || firForm.placeOfOccurrence,
        };

        // 2. Update status and open form
        await handleStatusUpdate('FIR Filed');
        setIsEditingFIR(true);

        // 3. Auto-generate narrative immediately
        const narrative = generateFormalFIR(incidentData.description, analysis?.sections || [], initialForm);
        setFirForm({ ...initialForm, narrative });
    };

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
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                                                <CheckCircle size={24} style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                                                <p>Case Filed Successfully</p>
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setIsEditingFIR(true)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                            >
                                                <FileText size={20} /> View / Edit Official FIR
                                            </button>
                                        </div>
                                    ) : status === 'Accepted' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ background: '#eff6ff', color: '#1e40af', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #bfdbfe' }}>
                                                <CheckCircle size={24} style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                                                <p>Case Accepted</p>
                                            </div>
                                            <button className="btn btn-primary" onClick={handleProceedToFIR}>
                                                Proceed to File FIR
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => handleStatusUpdate('Pending Review')}>
                                                Undo Accept
                                            </button>
                                        </div>
                                    ) : status === 'Rejected' ? (
                                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fecaca' }}>
                                            <XCircle size={24} style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                                            <p>Case Rejected / Declined</p>
                                            <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => handleStatusUpdate('Pending Review')}>
                                                Re-Open Case
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                className="btn btn-primary"
                                                style={{ backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                                onClick={() => handleStatusUpdate('Accepted')}
                                            >
                                                <CheckCircle size={20} /> Accept Case
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                style={{ color: '#dc2626', borderColor: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                                onClick={() => handleStatusUpdate('Rejected')}
                                            >
                                                <XCircle size={20} /> Reject Case
                                            </button>

                                            <div style={{ margin: '1rem 0', borderTop: '1px solid #eee' }}></div>

                                            <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => handleStatusUpdate('FIR Drafted')}>
                                                Generate Internal FIR Draft
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>Analyzing...</p>
                            )}
                        </div>

                    </div>

                    {/* FIR Modal/Form Overlay */}
                    {isEditingFIR && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: '1rem'
                        }}>
                            <div className="card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-saffron)', paddingBottom: '0.5rem' }}>
                                    <h2 style={{ color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={24} /> Official FIR - Form No. 1
                                    </h2>
                                    <button onClick={() => setIsEditingFIR(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); handleSaveFIR(); }} style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label className="label">Complainant Name</label>
                                            <input
                                                className="input"
                                                placeholder="e.g. Rajesh Kumar"
                                                value={firForm.complainantName}
                                                onChange={(e) => setFirForm({ ...firForm, complainantName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Contact Phone</label>
                                            <input
                                                className="input"
                                                placeholder="e.g. 98xxx xxxxx"
                                                value={firForm.complainantPhone}
                                                onChange={(e) => setFirForm({ ...firForm, complainantPhone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Complainant Address</label>
                                        <textarea
                                            className="textarea"
                                            rows={2}
                                            placeholder="Full permanent/current address..."
                                            value={firForm.complainantAddress}
                                            onChange={(e) => setFirForm({ ...firForm, complainantAddress: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label className="label">Place of Occurrence</label>
                                            <input
                                                className="input"
                                                placeholder="e.g. Central Market, Sector 12"
                                                value={firForm.placeOfOccurrence}
                                                onChange={(e) => setFirForm({ ...firForm, placeOfOccurrence: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Distance from Station</label>
                                            <input
                                                className="input"
                                                placeholder="e.g. 2 KM South"
                                                value={firForm.distanceFromStation}
                                                onChange={(e) => setFirForm({ ...firForm, distanceFromStation: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label className="label">Brief Facts of Case (Narrative)</label>
                                        <button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                fontSize: '0.8rem', color: '#7c3aed', background: '#f5f3ff',
                                                border: '1px solid #ddd6fe', padding: '0.2rem 0.6rem', borderRadius: '4px',
                                                cursor: 'pointer', fontWeight: 600
                                            }}
                                        >
                                            <Sparkles size={14} /> Auto-Generate with AI
                                        </button>
                                    </div>
                                    <textarea
                                        className="textarea"
                                        rows={5}
                                        value={firForm.narrative}
                                        onChange={(e) => setFirForm({ ...firForm, narrative: e.target.value })}
                                    />

                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditingFIR(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669' }}>
                                            Save Official Details
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
