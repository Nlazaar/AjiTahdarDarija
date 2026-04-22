'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { apiLogin, storeAuth } from '@/lib/auth';

export default function LoginPage() {
  const { mascot, setUser } = useUser();
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(email.trim(), password);
      storeAuth(res);
      setUser(res.user);
      router.push('/progress');
    } catch (err: any) {
      setError(err.message ?? 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', width: '100vw', backgroundColor: '#ffffff',
      fontFamily: '"Nunito", "Inter", sans-serif',
    }}>
      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: 1000, padding: '24px 20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, height: 16, backgroundColor: '#e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', backgroundColor: '#58cc02', borderRadius: 10 }} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 20, width: '100%', maxWidth: 1000,
      }}>
        {/* Mascot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48, justifyContent: 'center' }}>
          <div style={{ width: 110, flexShrink: 0 }}>
            <img src={mascot} alt="Mascotte" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{
            position: 'relative', backgroundColor: 'white', border: '2px solid #e5e5e5',
            borderRadius: 20, padding: '18px 22px', maxWidth: 300, boxShadow: '0 4px 0 #e5e5e5',
          }}>
            <div style={{
              position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%) rotate(45deg)',
              width: 16, height: 16, backgroundColor: 'white',
              borderLeft: '2px solid #e5e5e5', borderBottom: '2px solid #e5e5e5',
            }} />
            <p style={{ fontSize: 17, fontWeight: 800, color: '#4b4b4b', margin: '0 0 4px' }}>Content de te revoir !</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#afafaf', margin: 0 }}>Mrhba bik men jdid !</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4b4b4b', textAlign: 'center', margin: '0 0 6px' }}>
            Se connecter
          </h2>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12,
              padding: '10px 14px', fontSize: 13, color: '#dc2626', fontWeight: 600, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="E-MAIL" required autoComplete="email"
            style={inputStyle}
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="MOT DE PASSE" required autoComplete="current-password"
            style={inputStyle}
          />

          <p style={{ fontSize: 12, fontWeight: 700, color: '#afafaf', textAlign: 'center', lineHeight: 1.5, margin: '6px 0 0' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#1cb0f6', textDecoration: 'none', fontWeight: 800 }}>
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <div style={{ width: '100%', borderTop: '2px solid #e5e5e5', padding: '20px 40px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit as any}
            disabled={!canSubmit}
            style={{
              backgroundColor: canSubmit ? '#58cc02' : '#e5e5e5',
              color: canSubmit ? 'white' : '#afafaf',
              border: 'none', borderRadius: 16, padding: '15px 0',
              fontSize: 15, fontWeight: 900, letterSpacing: '0.08em',
              cursor: canSubmit ? 'pointer' : 'default',
              boxShadow: canSubmit ? '0 5px 0 #46a302' : 'none',
              width: '100%', maxWidth: 280, textTransform: 'uppercase', transition: 'all 0.15s',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#f7f7f7', border: '2px solid #e5e5e5',
  borderRadius: 16, padding: '16px 22px', fontSize: 15, fontWeight: 700,
  color: '#3c3c3c', outline: 'none', boxSizing: 'border-box',
};
