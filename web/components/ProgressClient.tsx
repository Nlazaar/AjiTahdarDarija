'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { getModules } from '@/lib/api';
import Mascotte from './Mascotte';
import Loader from './Loader';
import Link from 'next/link';
import { Check, Lock, Star } from 'lucide-react';

export default function ProgressClient() {
  const { loading, callApi } = useApi();
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    callApi(getModules).then(setModules).catch(() => {
       // Mock data if backend fails
       setModules([
         { id: '1', title: 'Les bases 1', progress: 100, lessons: [{id: 'l1'}, {id: 'l2'}, {id: 'l3'}] },
         { id: '2', title: 'Salutations', progress: 40, lessons: [{id: 'l4'}, {id: 'l5'}, {id: 'l6'}] },
         { id: '3', title: 'Au marché', progress: 0, lessons: [{id: 'l7'}, {id: 'l8'}, {id: 'l9'}] },
       ]);
    });
  }, []);

  if (loading && modules.length === 0) return <Loader />;

  return (
    <div className="max-w-xl mx-auto py-10 flex flex-col items-center gap-12">
      {modules.map((m, mIndex) => (
        <div key={m.id} className="w-full flex flex-col items-center">
           <div className="mb-6 text-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{m.title}</h3>
           </div>
           
           <div className="relative flex flex-col items-center gap-8">
              {m.lessons?.map((l: any, i: number) => {
                const isLocked = mIndex > 0 && modules[mIndex-1].progress < 100; // Simplified lock
                const isCompleted = m.progress === 100 || (m.progress > (i / m.lessons.length) * 100);
                const offset = (i % 2 === 0 ? '0' : (i % 4 === 1 ? '50px' : '-50px'));

                return (
                  <Link 
                    key={l.id} 
                    href={`/lesson/${l.id}`}
                    className={`relative z-10 transition-transform hover:scale-110 active:scale-95`}
                    style={{ transform: `translateX(${offset})` }}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-colors
                      ${isCompleted ? 'bg-yellow-400 border-yellow-600 text-white' : 
                        isLocked ? 'bg-slate-200 border-slate-300 text-slate-400' : 'bg-green-500 border-green-700 text-white'}
                    `}>
                      {isCompleted ? <Star fill="currentColor" size={32} /> : 
                       isLocked ? <Lock size={32} /> : <Star size={32} />}
                    </div>
                    
                    {/* Progress indicator ring */}
                    {!isLocked && !isCompleted && (
                       <div className="absolute -inset-2 border-4 border-slate-200 rounded-full border-t-green-500 animate-spin-slow opacity-50" />
                    )}
                  </Link>
                );
              })}

              {/* Character appearing near current progress */}
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 hidden md:block">
                 <div className="flex flex-col items-center">
                    <div className="mascotte-bubble mb-2">
                       <p className="text-xs font-bold text-slate-500">C'est parti !</p>
                    </div>
                    <Mascotte size={80} />
                 </div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
