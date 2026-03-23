"use client";

import React from "react";

export default function BottomActions({ canValidate, onSkip, onValidate }: { canValidate: boolean; onSkip: () => void; onValidate: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button onClick={onSkip} className="px-4 py-3 rounded-full border border-gray-200 text-gray-600 bg-white">PASSER</button>
        <div className="flex-1" />
        <button onClick={onValidate} disabled={!canValidate} className={`px-6 py-3 rounded-full text-white font-bold ${canValidate ? 'bg-[#58CC02] hover:brightness-105' : 'bg-gray-200'}`}>
          VALIDER
        </button>
      </div>
    </div>
  );
}
