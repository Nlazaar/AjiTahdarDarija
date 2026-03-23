"use client";

import React from "react";
import OptionCard from "./OptionCard";

export default function OptionGrid({ options, selectedId, onSelect }: { options: any[]; selectedId?: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {options.map((opt: any, i: number) => (
          <div key={opt.id} className="relative">
            <OptionCard id={opt.id} label={opt.label} image={opt.image} index={i + 1} selected={selectedId === opt.id} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}
