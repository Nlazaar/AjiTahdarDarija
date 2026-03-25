"use client";

import React from "react";

export default function OptionCard({
  id,
  label,
  image,
  index,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  image?: string;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      className={`
        relative flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border-2 transition-all duration-200 group
        ${selected 
          ? "border-royal bg-royal/5 shadow-[0_4px_0_#1b3a6b] -translate-y-1" 
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:translate-y-0 shadow-[0_4px_0_#e5e7eb]"}
      `}
      style={{ minWidth: 200 }}
    >
      <div className={`
        w-28 h-28 flex items-center justify-center rounded-xl transition-colors
        ${selected ? "bg-white" : "bg-gray-50 group-hover:bg-gray-100"}
      `}>
        {image ? (
          <img src={image} alt={label} className="max-w-[80%] max-h-[80%] object-contain" />
        ) : (
          <div className="text-5xl">🍊</div>
        )}
      </div>
      
      <div className={`text-base font-black tracking-tight ${selected ? "text-royal" : "text-gray-700"}`}>
        {label}
      </div>

      <div className={`
        absolute top-3 right-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center text-[10px] font-black transition-colors
        ${selected ? "border-royal text-royal" : "border-gray-200 text-gray-300"}
      `}>
        {index}
      </div>
    </button>
  );
}
