"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Target, Shield, Users, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>

                    {/* Hero Section */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 style={{ color: 'var(--color-navy)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                            About NyayaSetu
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                            Bridging the gap between citizens and legal clarity through advanced AI-assisted analysis and transparent workflows.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '4rem'
                    }}>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
                            <Target color="var(--color-navy)" size={32} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Our Mission</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                To empower every Indian citizen with immediate, accurate, and understandable legal insights into their grievances.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
                            <Shield color="var(--color-navy)" size={32} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Security & Safety</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Built with government-grade security standards to ensure that every report and data point is protected and handled with integrity.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
                            <Users color="var(--color-navy)" size={32} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Police Transparency</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Streamlining the communication between citizens and investigators to reduce pendency and increase trust in the justice system.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
                            <Award color="var(--color-navy)" size={32} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-navy)' }}>BNS Compliance</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Our AI models are specifically trained on the Bharatiya Nyaya Sanhita (BNS) 2023 to provide the most up-to-date legal classification.
                            </p>
                        </div>
                    </div>

                    {/* Detailed Section */}
                    <div style={{ padding: '3rem', backgroundColor: 'var(--color-navy)', color: 'white', borderRadius: '16px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>A Government of India Initiative</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
                            NyayaSetu is at the forefront of the Digital India movement, transforming how legal information is accessibility to the common man. By leveraging artificial intelligence, we shorten the distance between reported incidents and official action.
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
