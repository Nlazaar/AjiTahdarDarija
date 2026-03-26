"use client"
import React from "react";

export const ExerciseCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-[#1e2d35] rounded-2xl border border-[#2a3d47] p-6 w-full animate-fadeUp ${className}`}>
      {children}
    </div>
  );
};
export default ExerciseCard
