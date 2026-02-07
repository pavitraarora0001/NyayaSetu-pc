
// app/components/forms/IncidentForm.tsx
"use client";

import { useState } from 'react';
import { Mic, Image as ImageIcon, Send } from 'lucide-react';
import { analyzeIncident, AnalysisResult } from '@/lib/ai-logic';

export default function IncidentForm() {
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [incidentId, setIncidentId] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setIsSubmitting(true);

        // 1. Run AI Analysis
        setTimeout(async () => {
            const aiResponse = analyzeIncident(description);
            setResult(aiResponse);

            // 2. Save to "Backend" via API
            try {
                const response = await fetch('/api/incidents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        description: description,
                        analysis: aiResponse
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    setIncidentId(data.id);
                }
            } catch (err) {
                console.error("Failed to save incident", err);
            }

            setIsSubmitting(false);
        }, 1500);
    };

    const handleRegisterCase = async () => {
        if (!incidentId) return;
        setIsRegistering(true);

        try {
            const resp = await fetch('/api/incidents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: incidentId,
                    status: 'FIR Filed'
                })
            });

            if (resp.ok) {
                setIsRegistered(true);
            }
        } catch (err) {
            console.error("Failed to register case", err);
        } finally {
            setIsRegistering(false);
        }
    };

    if (result) {
        return (
            <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <h2 style={{ color: 'var(--color-navy)', borderBottom: '2px solid var(--color-saffron)', paddingBottom: '0.5rem' }}>AI Legal Analysis</h2>

                <div className="mt-4">
                    <strong>Incident Summary:</strong>
                    <p>{result.summary}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                        <span style={{
                            background: result.riskLevel === 'High' ? '#fee2e2' : '#ecfdf5',
                            color: result.riskLevel === 'High' ? '#b91c1c' : '#047857',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>
                            Risk Level: {result.riskLevel}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Applicable BNS Sections</h3>
                    {result.sections.length > 0 ? (
                        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '0.8rem' }}>BNS Section</th>
                                        <th style={{ padding: '0.8rem' }}>IPC Section</th>
                                        <th style={{ padding: '0.8rem' }}>Offence</th>
                                        <th style={{ padding: '0.8rem' }}>Punishment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.sections.map((sec, idx) => (
                                        <tr key={idx} style={{ borderBottom: idx === result.sections.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.8rem', fontWeight: 'bold', color: 'var(--color-navy)' }}>{sec.section}</td>
                                            <td style={{ padding: '0.8rem', color: '#64748b', fontWeight: 500 }}>{sec.ipc_section}</td>
                                            <td style={{ padding: '0.8rem' }}>{sec.description.split(" - ")[0]}</td>
                                            <td style={{ padding: '0.8rem', color: '#dc2626', fontWeight: 600 }}>{sec.punishment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No specific sections identified based on current input.</p>
                    )}
                </div>

                <div className="mt-4" style={{ background: '#e6fffa', padding: '1rem', borderRadius: '8px', border: '1px solid #b2f5ea' }}>
                    <h3 style={{ color: '#006d5c', fontSize: '1.1rem' }}>Procedural Guidance</h3>
                    <ul style={{ paddingLeft: '1.2rem', color: '#004d40' }}>
                        {result.guidance.map((guide, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{guide}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                    {!isRegistered ? (
                        <button
                            onClick={handleRegisterCase}
                            className="btn btn-primary w-full"
                            disabled={isRegistering || !incidentId}
                            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                        >
                            {isRegistering ? 'Registering...' : 'Register a Case / FIR'}
                        </button>
                    ) : (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            border: '1px solid #10b981'
                        }}>
                            ✓ Case / FIR Registered Successfully
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setResult(null);
                            setDescription('');
                            setIsRegistered(false);
                            setIncidentId(null);
                        }}
                        className="btn btn-secondary w-full"
                    >
                        Report Another Incident
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label">Describe the Incident / Occurrence</label>
                    <textarea
                        className="textarea"
                        required
                        placeholder="Please describe what happened in detail..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, gap: '0.5rem' }} disabled>
                        <ImageIcon size={20} /> Attach Evidence
                    </button>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, gap: '0.5rem' }} disabled>
                        <Mic size={20} /> Record Audio
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting || !description}
                    style={{ gap: '0.5rem' }}
                >
                    {isSubmitting ? 'Analyzing...' : <><Send size={20} /> Analyze Incident</>}
                </button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                *Information is processed securely. AI predictions are for assistance only.
            </p>
        </div>
    );
}
