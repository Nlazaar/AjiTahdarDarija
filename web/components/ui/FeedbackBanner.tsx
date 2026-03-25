"use client"
import React, { useEffect, useState } from "react"

interface FeedbackBannerProps {
  type: "correct" | "incorrect"
  message: string
  duration?: number
}


export const FeedbackBanner = ({ type, message }: { type: 'correct' | 'incorrect'; message: string }) => {
  if (type === 'correct') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold animate-fadeUp">
        <span className="text-lg font-black">✓</span>
        <span>{message}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold animate-fadeUp">
      <span className="text-lg font-black">✗</span>
      <span>{message}</span>
    </div>
  );
};

export default FeedbackBanner
