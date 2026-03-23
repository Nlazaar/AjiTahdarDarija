"use client";

import React from "react";
import { X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProgressHeader({ percent = 25, hearts = 3 }: { percent?: number; hearts?: number }) {
  const router = useRouter();
  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        <button aria-label="Fermer" onClick={() => router.back()} className="p-2 rounded-full text-gray-500 hover:bg-gray-50">
          <X size={22} />
        </button>

        <div className="flex-1">
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div style={{ width: `${percent}%` }} className="h-3 rounded-full bg-[#58CC02] transition-all duration-300" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-red-500 font-semibold">
          <Heart size={18} fill="currentColor" />
          <div className="text-sm">{hearts}</div>
        </div>
      </div>
    </div>
  );
}
