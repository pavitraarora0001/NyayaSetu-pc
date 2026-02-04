
// app/page.tsx
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoleSelector from "@/components/role-selection/RoleSelector";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleRoleSelect = (role: 'public' | 'police') => {
        if (role === 'public') {
            router.push('/public/report');
        } else {
            router.push('/police/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)' }}>
                {/* Hero Section */}
                <section style={{
                    background: 'linear-gradient(135deg, #000080 0%, #000040 100%)',
                    color: 'white',
                    padding: '4rem 1rem',
                    textAlign: 'center'
                }}>
                    <div className="container">
                        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 700, color: '#FFF' }}>
                            Bridge to <span style={{ color: 'var(--color-saffron)' }}>Justice</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                            Experience the power of AI-assisted legal analysis.
                            Built for accuracy, safety, and the Indian Justice Framework.
                        </p>
                    </div>
                </section>

                {/* Role Selection */}
                <RoleSelector />
            </main>
            <Footer />
        </div>
    );
}
