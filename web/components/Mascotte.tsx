import React from 'react';

export default function Mascotte({ size = 120, animation = true }: { size?: number; animation?: boolean }) {
  return (
    <div 
      className={animation ? 'animate-bounce-gentle' : ''} 
      style={{ width: size, height: size, display: 'inline-block' }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Body - Emerald Moroccan Green */}
        <path 
           d="M20,60 Q20,20 50,20 Q80,20 80,60 Q80,90 50,90 Q20,90 20,60" 
           fill="#10B981" 
           stroke="#059669" 
           strokeWidth="2" 
        />
        
        {/* Belly - Lighter green */}
        <ellipse cx="50" cy="65" rx="20" ry="15" fill="#34D399" opacity="0.8" />
        
        {/* Eyes */}
        <circle cx="38" cy="45" r="10" fill="white" />
        <circle cx="62" cy="45" r="10" fill="white" />
        <circle cx="40" cy="45" r="4" fill="#1F2937" />
        <circle cx="60" cy="45" r="4" fill="#1F2937" />
        
        {/* Beak / Nose - Moroccan Ocre */}
        <path d="M46,52 L54,52 L50,60 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
        
        {/* Wings */}
        <path d="M15,55 Q5,50 10,40" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M85,55 Q95,50 90,40" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
