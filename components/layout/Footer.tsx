
// app/components/layout/Footer.tsx

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--color-navy)',
            color: 'white',
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    <div>
                        <h3 style={{ borderBottom: '2px solid var(--color-saffron)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'inline-block' }}>
                            NyayaSetu
                        </h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.6 }}>
                            AI-Powered Incident Awareness & Legal Assistance Platform designed to accelerate justice delivery.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Emergency Contacts</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>🚓 Police Control: <strong>100 / 112</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>👩 Women Helpline: <strong>1091</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>🚑 Ambulance: <strong>108</strong></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Legal Disclaimer</h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            NyayaSetu provides legal assistance based on information supplied. Final authority rests with police officials and courts of law. This tool does not replace professional legal counsel.
                        </p>
                    </div>
                </div>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    opacity: 0.7
                }}>
                    &copy; {new Date().getFullYear()} Ministry of Law & Justice, Government of India. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
