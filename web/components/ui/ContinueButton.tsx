"use client"

export const ContinueButton = ({ onClick, label = "CONTINUER", disabled = false }: { onClick?: () => void; label?: string; disabled?: boolean }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 rounded-2xl text-white text-base font-black transition-all duration-100 animate-fade-up
        uppercase tracking-widest
        ${disabled 
          ? 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed shadow-[0_5px_0_#afafaf]' 
          : 'bg-[#58cc02] active:translate-y-0.5 shadow-[0_5px_0_#46a302] active:shadow-[0_2px_0_#46a302]'}
      `}
    >
      {label}
    </button>
  );
};
export default ContinueButton
