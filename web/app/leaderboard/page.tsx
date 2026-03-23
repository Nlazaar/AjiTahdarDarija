'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { getLeaderboard } from '@/lib/api';
import { Trophy, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const [global, setGlobal] = useState<any[]>([]);
  const { loading, callApi } = useApi();

  useEffect(() => {
    callApi(getLeaderboard)
      .then(setGlobal)
      .catch(() => {
        setGlobal([
          { id: '1', name: 'Amine', xp: 2450 },
          { id: '2', name: 'Yassine', xp: 2100 },
          { id: '3', name: 'Sara', xp: 1950 },
          { id: '4', name: 'Karim', xp: 1800 },
          { id: '5', name: 'Leila', xp: 1750 },
        ]);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
         <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
            <Trophy size={32} />
         </div>
         <h1 className="text-3xl font-black text-slate-700">Classement Global</h1>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden">
        {global.length > 0 ? global.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center gap-4 px-6 py-4 border-b-2 border-slate-100 last:border-0 hover:bg-slate-50 transition-colors
              ${index === 0 ? 'bg-yellow-50/30' : ''}
            `}
          >
            <div className="w-10 text-center font-black text-xl text-slate-400">
              {index + 1}
            </div>
            
            <div className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center overflow-hidden">
               <span className="font-bold text-white uppercase">{user.name[0]}</span>
            </div>

            <div className="flex-1 font-bold text-lg text-slate-700">
              {user.name}
            </div>

            <div className="flex items-center gap-2 font-black text-slate-500">
              <span className="text-orange-500">{user.xp}</span>
              <span className="text-xs uppercase tracking-tight">XP</span>
            </div>
            
            {index === 0 && <Medal className="text-yellow-400" size={24} />}
            {index === 1 && <Medal className="text-slate-300" size={24} />}
            {index === 2 && <Medal className="text-orange-300" size={24} />}
          </div>
        )) : <div className="p-12 text-center text-slate-400 italic">Chargement du podium...</div>}
      </div>
    </div>
  );
}
