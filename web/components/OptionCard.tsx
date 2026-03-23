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
      className={`flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border ${
        selected ? "ring-4 ring-[#58CC02]/30 transform -translate-y-1" : "hover:shadow-md"
      }`}
      style={{ minWidth: 220 }}
    >
      <div className="w-28 h-28 flex items-center justify-center bg-gray-50 rounded-xl">
        {image ? <img src={image} alt={label} className="max-w-full max-h-full" /> : <div className="text-4xl">🍩</div>}
      </div>
      <div className="text-base text-gray-700 font-semibold">{label}</div>
      <div className="absolute bottom-3 right-3 bg-gray-50 border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-xs text-gray-600">{index}</div>
    </button>
  );
}
