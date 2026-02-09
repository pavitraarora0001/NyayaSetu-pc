"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>

                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 style={{ color: 'var(--color-navy)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                            Helpline & Assistance
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                            We are here to help. Reach out through our official channels or emergency numbers.
                        </p>
                    </div>

                    {/* Emergency Numbers */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid #f87171',
                        marginBottom: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <AlertCircle color="#dc2626" size={48} style={{ marginBottom: '1rem' }} />
                        <h2 style={{ color: '#991b1b', marginBottom: '1.5rem' }}>Immediate Emergency Assistance</h2>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase' }}>National Emergency</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>112</p>
                            </div>
                            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase' }}>Police</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>100</p>
                            </div>
                            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase' }}>Women Helpline</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>1091</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Contact Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                                    <Mail color="var(--color-navy)" size={20} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold', color: 'var(--color-navy)' }}>Email Support</p>
                                    <p style={{ color: 'var(--text-secondary)' }}>support.nyayasetu@gov.in</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                                    <Phone color="var(--color-navy)" size={20} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold', color: 'var(--color-navy)' }}>Phone Support</p>
                                    <p style={{ color: 'var(--text-secondary)' }}>+91-11-2345-XXXX</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                                    <MapPin color="var(--color-navy)" size={20} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold', color: 'var(--color-navy)' }}>Office Address</p>
                                    <p style={{ color: 'var(--text-secondary)' }}>Ministry of Electronics & IT, New Delhi</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form MOCK */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Send us a Message</h3>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder="Your Name" className="textarea" style={{ height: 'auto', padding: '0.8rem' }} />
                                <input type="email" placeholder="Your Email" className="textarea" style={{ height: 'auto', padding: '0.8rem' }} />
                                <textarea placeholder="Message" className="textarea" rows={4}></textarea>
                                <button type="button" className="btn btn-primary" style={{ width: '100%' }}>Submit Feedback</button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
