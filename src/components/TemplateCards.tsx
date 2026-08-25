import React from 'react';
import { Film, Maximize2, FileText, GraduationCap, CheckCircle2 } from 'lucide-react';
import { TemplateId } from '../types';

interface TemplateCardsProps {
  onSelectTemplate: (templateId: TemplateId) => void;
  onOpenCustomSize: () => void;
}

export const TemplateCards: React.FC<TemplateCardsProps> = ({
  onSelectTemplate,
  onOpenCustomSize
}) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
      {/* Section label */}
      <div className="mb-2.5 sm:mb-3 text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-between">
        <span>Explore templates (ٹیمپلیٹس منتخب کریں)</span>
      </div>

      {/* Grid of Cards: 2 cards per row on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* Card 1: Blank (A4 Frame) */}
        <div
          id="template-card-blank"
          onClick={() => onSelectTemplate('blank')}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#ffe4e6] hover:bg-[#fed7db] border border-rose-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Blank Document</h3>
            <span className="text-[10px] sm:text-[11px] text-rose-900/70 font-medium">Standard A4</span>
          </div>

          <div className="flex justify-end items-end">
            <div className="w-14 sm:w-18 h-16 sm:h-20 bg-[#fb7185] rounded-l-md shadow-inner flex flex-col items-center justify-center p-1 border-l-2 border-t-2 border-white/50 relative overflow-hidden">
              <div className="w-10 sm:w-12 h-11 sm:h-14 border border-white/40 rounded-xs flex flex-col justify-between p-1">
                <div className="w-full h-1 bg-white/40 rounded-full" />
                <div className="w-4/5 h-1 bg-white/30 rounded-full" />
                <div className="w-full h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Formal Letter */}
        <div
          id="template-card-formal-letter"
          onClick={() => onSelectTemplate('formal-letter')}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#ede9fe] hover:bg-[#e4ddfd] border border-purple-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Formal Letter</h3>
            <span className="text-[10px] sm:text-[11px] text-purple-900/70 font-medium">Official Notice</span>
          </div>

          <div className="flex justify-end items-end">
            <div className="w-16 sm:w-20 h-14 sm:h-18 bg-[#c084fc] rounded-tl-xl p-1.5 sm:p-2 flex flex-col justify-between shadow-inner border-l-2 border-t-2 border-white/60">
              <div className="space-y-1">
                <div className="w-6 sm:w-8 h-1 sm:h-1.5 bg-white/80 rounded-full" />
                <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-white/60 rounded-full" />
                <div className="w-8 sm:w-10 h-0.5 sm:h-1 bg-white/50 rounded-full" />
              </div>
              <div className="w-5 sm:w-6 h-0.5 sm:h-1 bg-white/70 self-end rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 3: Poetry & Ghazal */}
        <div
          id="template-card-poetry"
          onClick={() => onSelectTemplate('poetry')}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#e0e7ff] hover:bg-[#d5dffc] border border-indigo-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Poetry & Ghazal</h3>
            <span className="text-[10px] sm:text-[11px] text-indigo-900/70 font-medium">شاعری و غزل</span>
          </div>

          <div className="flex flex-col items-end justify-end space-y-1.5 pb-2 pr-1">
            <div className="w-11 sm:w-14 h-1.5 sm:h-2 bg-indigo-500 rounded-full shadow-xs" />
            <div className="w-8 sm:w-10 h-1.5 sm:h-2 bg-indigo-400 rounded-full shadow-xs" />
            <div className="w-11 sm:w-14 h-1.5 sm:h-2 bg-indigo-500 rounded-full shadow-xs" />
          </div>
        </div>

        {/* Card 4: Exam / Question Paper */}
        <div
          id="template-card-exam-questions"
          onClick={() => onSelectTemplate('exam-questions')}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#dcfce7] hover:bg-[#cbf7db] border border-emerald-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Exam Paper</h3>
            <span className="text-[10px] sm:text-[11px] text-emerald-900/70 font-medium">امتحانی پرچہ</span>
          </div>

          <div className="flex justify-end items-end">
            <div className="w-14 sm:w-18 h-14 sm:h-18 -mr-2 -mb-2 rounded-full bg-[#bbf7d0] border-3 sm:border-4 border-white/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-700 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* Card 5: Urdu Script */}
        <div
          id="template-card-urdu-script"
          onClick={() => onSelectTemplate('urdu-script')}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#fef3c7] hover:bg-[#feeaa0] border border-amber-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Urdu Script</h3>
            <span className="text-[10px] sm:text-[11px] text-amber-900/70 font-medium">ڈراما و سکرپٹ</span>
          </div>

          <div className="flex justify-end items-end">
            <div className="w-14 sm:w-18 h-14 sm:h-18 -mr-2 -mb-2 rounded-full bg-[#fde68a] border-3 sm:border-4 border-white/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* Card 6: Custom Size */}
        <div
          id="template-card-custom-size"
          onClick={onOpenCustomSize}
          className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-[#cffafe] hover:bg-[#bcf4fa] border border-cyan-200/70 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-36 sm:h-40"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Custom Size</h3>
            <span className="text-[10px] sm:text-[11px] text-cyan-900/70 font-medium">سائز منتخب کریں</span>
          </div>

          <div className="flex justify-end items-end">
            <div className="w-14 sm:w-18 h-14 sm:h-18 -mr-2 -mb-2 rounded-full bg-[#a5f3fc] border-3 sm:border-4 border-white/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Maximize2 className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-700 stroke-[1.75]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
