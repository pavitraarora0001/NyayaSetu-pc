"use client";

import { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, CheckCircle, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CaseStatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = use(params);
    const id = rawId.replace(/_/g, '/'); // Decode slash for FIR numbers

    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await fetch('/api/incidents');
                const data = await response.json();

                // Find by ID or FIR Number
                const found = data.find((inc: any) =>
                    inc.id === id || inc.firNumber === id
                );

                if (found) {
                    setIncident(found);
                } else {
                    setError("Case not found. Please check your ID and try again.");
                }
            } catch (err) {
                setError("Failed to fetch case status.");
            } finally {
                setLoading(false);
            }
        };

        fetchIncident();
    }, [id]);

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'New':
            case 'Pending Review': return 1;
            case 'Accepted':
            case 'FIR Drafted': return 2;
            case 'FIR Filed': return 3;
            default: return 1;
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Status...</div>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>

                    <Link href="/public" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-navy)', marginBottom: '2rem', textDecoration: 'none', fontWeight: 600 }}>
                        <ArrowLeft size={20} /> Back to Reporting
                    </Link>

                    {error ? (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fee2e2', borderRadius: '16px', border: '1px solid #fecaca' }}>
                            <p style={{ color: '#991b1b', fontSize: '1.2rem' }}>{error}</p>
                            <Link href="/public" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Try Again</Link>
                        </div>
                    ) : (
                        <div>
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <h1 style={{ color: 'var(--color-navy)', fontSize: '1.8rem', margin: 0 }}>Case Tracking</h1>
                                        <p style={{ color: 'var(--text-secondary)' }}>ID: {incident.id}</p>
                                        {incident.firNumber && (
                                            <div style={{ marginTop: '0.5rem', display: 'inline-block', backgroundColor: '#f0f9ff', color: '#0369a1', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700 }}>
                                                OFFICIAL FIR: {incident.firNumber}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: incident.status === 'FIR Filed' ? '#dcfce7' : '#fef3c7', color: incident.status === 'FIR Filed' ? '#166534' : '#92400e', fontWeight: 'bold' }}>
                                        {incident.status}
                                    </div>
                                </div>

                                {/* Progress Stepper */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '3rem', padding: '0 2rem' }}>
                                    <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
                                    <div style={{ position: 'absolute', top: '24px', left: '10%', width: getStatusStep(incident.status) === 1 ? '0%' : getStatusStep(incident.status) === 2 ? '40%' : '80%', height: '2px', backgroundColor: 'var(--color-navy)', zIndex: 0, transition: 'width 0.5s ease' }}></div>

                                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '60px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 0.5rem' }}>
                                            <Clock size={20} />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reported</p>
                                    </div>

                                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '60px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: getStatusStep(incident.status) >= 2 ? 'var(--color-navy)' : 'white', border: '2px solid' + (getStatusStep(incident.status) >= 2 ? 'var(--color-navy)' : '#e2e8f0'), color: getStatusStep(incident.status) >= 2 ? 'white' : '#94a3b8', display: 'grid', placeItems: 'center', margin: '0 auto 0.5rem' }}>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: getStatusStep(incident.status) >= 2 ? 'black' : '#94a3b8' }}>Accepted</p>
                                    </div>

                                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '60px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: getStatusStep(incident.status) >= 3 ? 'var(--color-navy)' : 'white', border: '2px solid' + (getStatusStep(incident.status) >= 3 ? 'var(--color-navy)' : '#e2e8f0'), color: getStatusStep(incident.status) >= 3 ? 'white' : '#94a3b8', display: 'grid', placeItems: 'center', margin: '0 auto 0.5rem' }}>
                                            <FileCheck size={20} />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: getStatusStep(incident.status) >= 3 ? 'black' : '#94a3b8' }}>FIR Filed</p>
                                    </div>
                                </div>

                                {/* Information Cards */}
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                        <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Incident Summary</h3>
                                        <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>{incident.description}</p>
                                    </div>

                                    {incident.status === 'FIR Filed' && (
                                        <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: '#166534' }}>
                                                <CheckCircle size={18} />
                                                <h3 style={{ fontSize: '1rem', margin: 0 }}>Official Record Registered</h3>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#166534' }}>
                                                Your case has been formally registered as an FIR. You may be contacted by the investigating officer at the provided details.
                                            </p>
                                        </div>
                                    )}

                                    {incident.analysis && (
                                        <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                            <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>Legal Classification</h3>

                                            <div style={{ overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                    <thead style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                                        <tr>
                                                            <th style={{ padding: '0.75rem' }}>BNS Section</th>
                                                            <th style={{ padding: '0.75rem' }}>IPC (Legacy)</th>
                                                            <th style={{ padding: '0.75rem' }}>Description</th>
                                                            <th style={{ padding: '0.75rem' }}>Max Punishment</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {incident.analysis.sections.map((s: any, i: number) => (
                                                            <tr key={i} style={{ borderBottom: i === incident.analysis.sections.length - 1 ? 'none' : '1px solid #f8fafc' }}>
                                                                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--color-navy)' }}>{s.section}</td>
                                                                <td style={{ padding: '0.75rem', color: '#64748b' }}>{s.ipc_section}</td>
                                                                <td style={{ padding: '0.75rem' }}>{s.description.split(" - ")[0]}</td>
                                                                <td style={{ padding: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>{s.punishment}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>System Preliminary Guidance</h3>
                                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                                {incident.analysis.guidance.map((g: string, i: number) => (
                                                    <li key={i} style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.3rem' }}>{g}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
