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
    <div className="relative bg-gradient-to-r from-[#2f5bf5] via-[#3d42e6] to-[#4e36d4] pt-10 sm:pt-16 pb-24 sm:pb-32 px-4 sm:px-8 text-white overflow-hidden">
      {/* Background ambient lighting and subtle radial glows */}
      <div className="absolute -top-12 left-1/4 w-[36rem] h-[36rem] bg-blue-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md font-sans leading-tight">
          What will you Write today?
        </h1>

        {/* Authentic Urdu Nastaliq Subtitle */}
        <p className="font-nastaliq text-2xl sm:text-3xl md:text-4xl text-white/95 mt-3 sm:mt-5 drop-shadow-md font-medium tracking-wide">
          آج آپ کیا لکھنا پسند کریں گے؟
        </p>

        {/* Centered navigation pill buttons matching image */}
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 mt-7 sm:mt-9">
          <button
            id="hero-nav-home"
            className="flex items-center gap-2 px-6 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-gray-900 shadow-xl shadow-black/15 hover:bg-gray-100 transition active:scale-98 cursor-pointer"
          >
            <Home className="w-4 h-4 fill-gray-900 text-gray-900" />
            <span>Home</span>
          </button>

          <button
            id="hero-nav-templates"
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-6 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md transition active:scale-98 cursor-pointer shadow-lg shadow-black/10"
          >
            <Layers className="w-4 h-4 text-white" />
            <span>Templates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
