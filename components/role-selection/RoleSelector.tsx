// app/components/role-selection/RoleSelector.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Shield, User } from 'lucide-react';
// import styles from './RoleSelector.module.css'; // Using inline styles for simplicity/robustness if module fails, but module is better.
// Actually, let's stick to the module approach but ensure the file exists.

// Simple inline styles to guarantee it works without waiting for CSS modules compilation issues
const styles = {
    container: "role-container",
    header: "role-header",
    title: "role-title",
    subtitle: "role-subtitle",
    grid: "role-grid",
    card: "role-card",
    icon: "role-icon",
    btn: "role-btn"
};

interface RoleCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: string;
}

function RoleCard({ title, description, icon, onClick, color }: RoleCardProps) {
    return (
        <div onClick={onClick} style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
            <div style={{ color: color }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>{title}</h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>{description}</p>
            <button style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: `1px solid ${color}`,
                background: 'transparent',
                color: color,
                fontWeight: 600,
                width: '100%'
            }}>Proceed &rarr;</button>
        </div>
    );
}

export default function RoleSelector() {
    const router = useRouter();

    return (
        <section style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#000080', marginBottom: '0.5rem' }}>Select Your Role</h2>
                <p style={{ color: '#666' }}>Choose how you would like to interact with NyayaSetu</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <RoleCard
                    title="Public User"
                    description="Report incidents, get simplified legal guidance, and find help."
                    icon={<User size={48} />}
                    color="#FF9933" // Saffron
                    onClick={() => router.push('/public')}
                />

                <RoleCard
                    title="Police Officer"
                    description="Draft FIRs, analyze cases with legal precision, and manage reports."
                    icon={<Shield size={48} />}
                    color="#000080" // Navy
                    onClick={() => router.push('/police')}
                />
            </div>
        </section>
    );
}
