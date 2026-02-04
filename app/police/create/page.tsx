
// app/police/create/page.tsx
"use client";

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { analyzeIncident, AnalysisResult } from '@/lib/ai-logic';
import { ArrowLeft, CheckCircle, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManualEntry() {
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        complainantName: '',
        contactNumber: '',
        address: '',
        incidentDate: '',
        incidentTime: '',
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

    // Step 1: Analyze
    const handleAnalyze = async () => {
        if (!formData.description.trim()) return;
        setIsAnalyzing(true);
        // Simulate delay
        setTimeout(() => {
            const result = analyzeIncident(formData.description);
            setAnalysis(result);

            // Auto-populate IPC sections
            if (result.sections.length > 0) {
                const ipcStrings = result.sections
                    .map(s => `${s.section} (${s.ipc_section})`)
                    .join(', ');
                setFormData(prev => ({ ...prev, customSections: ipcStrings }));
            }

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
                        incidentDate: formData.incidentDate,
                        incidentTime: formData.incidentTime,
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
                            <div className="input-group">
                                <label className="label">Date of Incident</label>
                                <input
                                    type="date"
                                    name="incidentDate"
                                    className="input"
                                    value={formData.incidentDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="label">Time of Incident</label>
                                <input
                                    type="time"
                                    name="incidentTime"
                                    className="input"
                                    value={formData.incidentTime}
                                    onChange={handleChange}
                                />
                            </div>
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
                                <input
                                    type="text"
                                    name="customSections"
                                    className="input"
                                    placeholder="e.g. BNS 303 (Theft), IPC 379"
                                    value={formData.customSections || ''}
                                    onChange={handleChange}
                                />
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
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <strong>Identified Offences:</strong>
                                    <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                                        {analysis.sections.length > 0 ? analysis.sections.map((s, idx) => (
                                            <li key={idx}>
                                                {s.section} <span style={{ color: '#666' }}>({s.ipc_section})</span>
                                            </li>
                                        )) : <li>No specific section identified (General Complaint)</li>}
                                    </ul>
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
