'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
  const { mascot } = useUser();
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', 
      fontFamily: '"Nunito", "Inter", sans-serif'
    }}>
      {/* 1. Progress Bar (Advance to ~70%) */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        padding: '24px 20px', 
        display: 'flex', 
        alignItems: 'center'
      }}>
        <div style={{ 
          flex: 1, 
          height: '16px', 
          backgroundColor: '#e5e5e5', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            width: '70%', 
            height: '100%', 
            backgroundColor: '#58cc02', 
            borderRadius: '10px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
        maxWidth: '1000px',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        
        {/* Mascot + Bubble Intro */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: '20px',
          marginBottom: '50px',
          width: '100%',
          justifyContent: 'center'
        }}>
          <div className="animate-mascot" style={{ width: '120px', flexShrink: 0 }}>
            <img 
              src={mascot} 
              alt="Mascot Teacher" 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Speech Bubble */}
          <div style={{ 
            position: 'relative',
            backgroundColor: 'white',
            border: '2px solid #e5e5e5',
            borderRadius: '20px',
            padding: '20px 24px',
            maxWidth: '350px',
            boxShadow: '0 4px 0 #e5e5e5'
          }}>
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderLeft: '2px solid #e5e5e5',
              borderBottom: '2px solid #e5e5e5'
            }}></div>

            <div style={{ textAlign: 'left' }}>
               <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#4b4b4b', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                  C&apos;est l&apos;heure de créer ton profil !
               </h1>
               <p style={{ fontSize: '14px', fontWeight: '700', color: '#afafaf', margin: '0' }}>
                  Daba khassna ncreyiw el profil dyalek !
               </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          width: '100%',
          maxWidth: '380px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#4b4b4b', textAlign: 'center' }}>S&apos;inscrire</h2>
          </div>
          
          <input 
            placeholder="E-MAIL" 
            style={inputStyle()} 
          />
          <input 
            placeholder="MOT DE PASSE" 
            type="password"
            style={inputStyle()} 
          />
          
          <p style={{ marginTop: '20px', fontSize: '13px', fontWeight: '700', color: '#afafaf', textAlign: 'center', lineHeight: '1.5' }}>
            En continuant sur Darija Maroc, vous acceptez nos <span style={{ textDecoration: 'underline' }}>Conditions d&apos;utilisation</span> et notre <span style={{ textDecoration: 'underline' }}>Politique de confidentialité</span>.
          </p>
        </div>
      </div>

      {/* 3. Footer with Action Buttons */}
      <div style={{ 
        width: '100%', 
        borderTop: '2px solid #e5e5e5', 
        padding: '24px 40px', 
        display: 'flex', 
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '20px'
        }}>
          <button style={{
            backgroundColor: '#58cc02',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '900',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 5px 0 #46a302',
            width: '100%',
            maxWidth: '280px',
            textTransform: 'uppercase',
            transition: 'filter 0.1s'
          }}>
            S&apos;inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

function inputStyle() {
  return {
    width: '100%',
    backgroundColor: '#f7f7f7',
    border: '2px solid #e5e5e5',
    borderRadius: '16px',
    padding: '18px 24px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#3c3c3c',
    outline: 'none',
    transition: 'all 0.2s'
  } as React.CSSProperties;
}
