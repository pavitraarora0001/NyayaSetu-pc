"use client";

// app/public/page.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IncidentForm from '@/components/forms/IncidentForm';

export default function PublicPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '2rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ color: 'var(--color-navy)', fontSize: '2rem' }}>Report an Incident</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Describe what happened. NyayaSetu will help you understand the legal aspects.
                        </p>
                    </div>

                    <IncidentForm />

                    {/* Case Tracking Section */}
                    <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--color-navy)', fontSize: '1.5rem' }}>Track Your Case</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Enter your Incident ID (INC-...) or FIR Number to check its current status.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
                            <input
                                id="case-search-input"
                                type="text"
                                placeholder="e.g. INC-2026-001 or FIR/2026/001"
                                className="textarea"
                                style={{ height: 'auto', padding: '0.8rem', flex: 1 }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const val = (document.getElementById('case-search-input') as HTMLInputElement).value;
                                    if (val) window.location.href = `/public/status/${val.replace(/\//g, '_')}`;
                                }}
                            >
                                Track Case
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
