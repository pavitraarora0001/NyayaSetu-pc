
// app/police/create/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { analyzeIncident, AnalysisResult } from '@/lib/ai-logic';
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManualEntry() {
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        complainantName: '',
        contactNumber: '',
        address: '',
        location: '',
        description: '',
        customSections: ''
    });

    const [isanalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Auto-analyze description for sections (Debounced)
    useEffect(() => {
        if (!formData.description.trim()) {
            setFormData(prev => ({ ...prev, customSections: '' }));
            return;
        }

        const timer = setTimeout(() => {
            const result = analyzeIncident(formData.description);
            if (result.sections.length > 0) {
                const ipcStrings = result.sections
                    .map(s => `${s.section} (${s.ipc_section})`)
                    .join(', ');
                setFormData(prev => ({ ...prev, customSections: ipcStrings }));
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [formData.description]);

    // Step 1: Analyze (Manual Trigger if needed)
    const handleAnalyze = async () => {
        if (!formData.description.trim()) return;
        setIsAnalyzing(true);
        // Simulate delay for manual analysis preview
        setTimeout(() => {
            const result = analyzeIncident(formData.description);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 1000);
    };

    // Step 2: Register
    const handleRegister = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: formData.description,
                    // Pass other metadata to be saved
                    metadata: {
                        complainant: formData.complainantName,
                        contact: formData.contactNumber,
                        location: formData.location
                    },
                    analysis,
                    status: 'FIR Filed'
                })
            });
            router.push('/police'); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setIsSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '2rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>

                    <Link href="/police" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-navy)', fontWeight: 500 }}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>

                    <div className="card">
                        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
                            New Manual Entry (FIR Registration)
                        </h1>

                        {/* Section 1: Complainant Details */}
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#4b5563', borderBottom: '1px dashed #ddd', paddingBottom: '0.5rem' }}>1. Complainant Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="input-group">
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    name="complainantName"
                                    className="input"
                                    placeholder="e.g. Rajesh Kumar"
                                    value={formData.complainantName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="label">Contact Number</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    className="input"
                                    placeholder="e.g. 9876543210"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="input"
                                    placeholder="Complainant's residential address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Section 2: Incident Details */}
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#4b5563', borderBottom: '1px dashed #ddd', paddingBottom: '0.5rem' }}>2. Incident Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="label">Place of Occurrence</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="input"
                                    placeholder="Complete address of location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="label">Acts & Sections (IPC/BNS)</label>

                                {formData.description && (
                                    <div style={{ marginBottom: '1rem', overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                            <thead style={{ textAlign: 'left', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                                <tr>
                                                    <th style={{ padding: '0.5rem' }}>BNS</th>
                                                    <th style={{ padding: '0.5rem' }}>IPC</th>
                                                    <th style={{ padding: '0.5rem' }}>Offence</th>
                                                    <th style={{ padding: '0.5rem' }}>Punishment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analyzeIncident(formData.description).sections.map((s, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                        <td style={{ padding: '0.5rem', fontWeight: 600, color: '#1e40af' }}>{s.section}</td>
                                                        <td style={{ padding: '0.5rem', color: '#64748b' }}>{s.ipc_section}</td>
                                                        <td style={{ padding: '0.5rem' }}>{s.description.split(" - ")[0]}</td>
                                                        <td style={{ padding: '0.5rem', color: '#dc2626', fontWeight: 600 }}>{s.punishment}</td>
                                                    </tr>
                                                ))}
                                                {analyzeIncident(formData.description).sections.length === 0 && (
                                                    <tr><td colSpan={3} style={{ padding: '0.8rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>Start typing description to see matches...</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="customSections"
                                    className="input"
                                    placeholder="e.g. BNS 303 (Theft), IPC 379"
                                    value={formData.customSections || ''}
                                    onChange={handleChange}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>*Table above is auto-suggested. You can manually edit the text field.</p>
                            </div>
                        </div>

                        {/* Section 3: Description */}
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#4b5563', borderBottom: '1px dashed #ddd', paddingBottom: '0.5rem' }}>3. Incident Description</h3>
                        <div className="input-group">
                            <label className="label">Witness Statement / Officer Notes</label>
                            <textarea
                                className="textarea"
                                name="description"
                                rows={6}
                                placeholder="Enter detailed account of the incident..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <button className="btn btn-secondary" style={{ width: '100%', gap: '0.5rem' }}>
                            <Upload size={18} /> Upload Scanned Document / Evidence
                        </button>
                    </div>

                    {!analysis ? (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', gap: '0.5rem' }}
                            onClick={handleAnalyze}
                            disabled={isanalyzing || !formData.description}
                        >
                            {isanalyzing ? 'Analyzing...' : <><FileText size={18} /> Analyze & Preview</>}
                        </button>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={18} color="green" /> Analysis Ready
                                </h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>Identified Legal Sections:</strong>
                                    <div style={{ overflowX: 'auto', marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                                <tr>
                                                    <th style={{ padding: '0.6rem' }}>BNS Section</th>
                                                    <th style={{ padding: '0.6rem' }}>IPC Section</th>
                                                    <th style={{ padding: '0.6rem' }}>Offence</th>
                                                    <th style={{ padding: '0.6rem' }}>Punishment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysis.sections.length > 0 ? analysis.sections.map((s, idx) => (
                                                    <tr key={idx} style={{ borderBottom: idx === analysis.sections.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '0.6rem', fontWeight: 600, color: '#1e40af' }}>{s.section}</td>
                                                        <td style={{ padding: '0.6rem', color: '#64748b' }}>{s.ipc_section}</td>
                                                        <td style={{ padding: '0.6rem' }}>{s.description.split(" - ")[0]}</td>
                                                        <td style={{ padding: '0.6rem', color: '#dc2626', fontWeight: 600 }}>{s.punishment}</td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>No sections identified</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem', background: '#e6f6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bae6ff' }}>
                                    <h4 style={{ color: '#003eb3', fontSize: '1rem', marginBottom: '0.5rem' }}>Constitutional Provisions</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {analysis.constitution.map((art, idx) => (
                                            <div key={idx} style={{ background: 'white', padding: '0.6rem', borderRadius: '6px', border: '1px solid #91d5ff', fontSize: '0.85rem' }}>
                                                <strong style={{ color: 'var(--color-navy)' }}>{art.id}: {art.title}</strong>
                                                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>{art.description}</p>
                                            </div>
                                        ))}
                                        {analysis.constitution.length === 0 && <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#64748b' }}>No direct Constitutional Articles identified.</p>}
                                    </div>
                                </div>

                                <p><strong>Risk Level:</strong> {analysis.riskLevel}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setAnalysis(null)}
                                >
                                    Edit Details
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, backgroundColor: '#059669' }}
                                    onClick={handleRegister}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Registering...' : 'Register Official Case'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
