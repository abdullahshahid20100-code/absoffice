import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onOpenTemplates: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTemplates
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-2.5 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#3b5bfd] flex items-center justify-center text-white shadow-sm shadow-[#3b5bfd]/30 shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
              ABS Office
            </span>
            <span className="text-[10px] uppercase font-bold bg-[#fff1e7] text-[#c2410c] px-2 py-0.5 rounded-md border border-[#fed7aa]/70 tracking-wider">
              NOTEPAD
            </span>
          </div>
        </div>

        {/* Right: Create Design Action Button (Vibrant Rose/Magenta Pill) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-create-design"
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#d92672] to-[#c026d3] hover:from-[#c2185b] hover:to-[#a21caf] active:scale-98 rounded-full shadow-sm shadow-[#d92672]/30 transition cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full border-1.5 border-white flex items-center justify-center shrink-0">
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
            </div>
            <span className="hidden xs:inline sm:inline">Create Design</span>
            <span className="xs:hidden sm:hidden">Design</span>
          </button>
        </div>
      </div>
    </header>
  );
};
