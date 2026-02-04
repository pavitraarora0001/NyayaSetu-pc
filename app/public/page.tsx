
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
                </div>
            </main>
            <Footer />
        </div>
    );
}
