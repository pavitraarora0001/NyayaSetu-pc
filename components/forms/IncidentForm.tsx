
// app/components/forms/IncidentForm.tsx
"use client";

import { useState } from 'react';
import { Mic, Image as ImageIcon, Send } from 'lucide-react';
import { analyzeIncident, AnalysisResult } from '@/lib/ai-logic';

export default function IncidentForm() {
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setIsSubmitting(true);

        // 1. Run AI Analysis
        // Simulate network delay for realism
        setTimeout(async () => {
            const aiResponse = analyzeIncident(description);
            setResult(aiResponse);

            // 2. Save to "Backend" via API
            try {
                await fetch('/api/incidents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        description: description,
                        analysis: aiResponse
                    })
                });
            } catch (err) {
                console.error("Failed to save incident", err);
            }

            setIsSubmitting(false);
        }, 1500);
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
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ background: '#f0f0f5', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ padding: '0.5rem' }}>BNS Section</th>
                                    <th style={{ padding: '0.5rem' }}>IPC Ref (Legacy)</th>
                                    <th style={{ padding: '0.5rem' }}>Description</th>
                                    <th style={{ padding: '0.5rem' }}>Punishment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.sections.map((sec, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold', color: '#000080' }}>{sec.section}</td>
                                        <td style={{ padding: '0.5rem', color: '#666', fontWeight: 500 }}>{sec.ipc_section || 'N/A'}</td>
                                        <td style={{ padding: '0.5rem' }}>{sec.description}</td>
                                        <td style={{ padding: '0.5rem' }}>{sec.punishment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                <button
                    onClick={() => { setResult(null); setDescription(''); }}
                    className="btn btn-secondary mt-4 w-full"
                >
                    Report Another Incident
                </button>
            </div>
        );
    }

    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label">Describe the Incident</label>
                    <textarea
                        className="textarea"
                        rows={6}
                        placeholder="Please describe what happened in detail (e.g., I was walking in the market and someone snatched my phone)..."
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
