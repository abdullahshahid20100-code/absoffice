import React from 'react';
import { Home, Layers } from 'lucide-react';

interface HeroSectionProps {
  onOpenTemplates: () => void;
  activeView: 'home' | 'templates';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenTemplates,
  activeView
}) => {
  return (
    <div className="relative bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#4338ca] pt-8 sm:pt-12 pb-20 sm:pb-24 px-3 sm:px-8 text-white overflow-hidden shadow-inner">
      {/* Background subtle geometric glow decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm font-sans leading-tight">
          What will you Write today?
        </h1>

        {/* Authentic Urdu Nastaliq Subtitle */}
        <p className="font-nastaliq text-xl sm:text-2xl md:text-3xl text-white/95 mt-2.5 sm:mt-4 drop-shadow-sm font-medium tracking-wide">
          آج آپ کیا لکھنا پسند کریں گے؟
        </p>

        {/* Centered navigation pill buttons */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
          <button
            id="hero-nav-home"
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-blue-600 shadow-md shadow-black/10 hover:bg-gray-50 transition active:scale-98"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span>Home</span>
          </button>

          <button
            id="hero-nav-templates"
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm transition active:scale-98"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Templates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
