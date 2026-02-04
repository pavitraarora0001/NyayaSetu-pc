
// app/components/layout/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header" style={{
      borderBottom: '4px solid var(--color-saffron)',
      backgroundColor: 'var(--color-white)',
      padding: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mock Emblem / Logo */}
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-navy)',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            GOI
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', margin: 0 }}>
              NyayaSetu
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Bridge to Justice | Government of India Initiative
            </p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
          <Link href="/" style={{ color: 'var(--color-navy)' }}>Home</Link>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
          <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Helpline</Link>
          <Link href="/" style={{
            color: 'var(--color-white)',
            backgroundColor: '#dc2626',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}
