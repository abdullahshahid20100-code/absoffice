import React from 'react';
import { Film, Maximize2, GraduationCap } from 'lucide-react';
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
    <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-12 sm:-mt-16 relative z-20">
      {/* Section label */}
      <div className="mb-3 text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-between">
        <span>Explore templates (ٹیمپلیٹس منتخب کریں)</span>
      </div>

      {/* Grid of Cards: 2 cards per row on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Blank (A4 Frame) */}
        <div
          id="template-card-blank"
          onClick={() => onSelectTemplate('blank')}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Blank Document</h3>
            <span className="text-[10px] sm:text-[11px] text-teal-700 font-medium">Standard A4</span>
          </div>

          <div className="flex justify-center items-end pt-2">
            <div className="w-14 sm:w-16 h-16 sm:h-18 border-2 border-slate-700/80 rounded-sm p-1.5 flex flex-col justify-center gap-1.5 bg-white group-hover:border-slate-900 transition">
              <div className="w-full h-1 bg-slate-700/80 rounded-full" />
              <div className="w-full h-1 bg-slate-700/80 rounded-full" />
              <div className="w-3/4 mx-auto h-1 bg-slate-700/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 2: Formal Letter */}
        <div
          id="template-card-formal-letter"
          onClick={() => onSelectTemplate('formal-letter')}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Formal Letter</h3>
            <span className="text-[10px] sm:text-[11px] text-teal-700 font-medium">Official Notice</span>
          </div>

          <div className="flex justify-center items-end pt-2">
            <div className="w-16 sm:w-18 h-14 sm:h-16 border-2 border-slate-700/80 rounded-sm p-1.5 flex flex-col justify-between bg-white group-hover:border-slate-900 transition">
              <div className="space-y-1">
                <div className="w-6 h-1 bg-slate-700/80 rounded-full" />
                <div className="w-10 h-0.5 bg-slate-500 rounded-full" />
                <div className="w-8 h-0.5 bg-slate-400 rounded-full" />
              </div>
              <div className="w-4 h-0.5 bg-slate-700/80 self-end rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 3: Poetry & Ghazal */}
        <div
          id="template-card-poetry"
          onClick={() => onSelectTemplate('poetry')}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Poetry & Ghazal</h3>
            <span className="text-[10px] sm:text-[11px] text-teal-700 font-medium font-nastaliq">شاعری و غزل</span>
          </div>

          <div className="flex flex-col items-center justify-end space-y-2 pb-2">
            <div className="w-12 sm:w-14 h-2 border-2 border-slate-700/80 rounded-full group-hover:border-slate-900 transition" />
            <div className="w-8 sm:w-10 h-2 border-2 border-slate-700/80 rounded-full group-hover:border-slate-900 transition" />
            <div className="w-12 sm:w-14 h-2 border-2 border-slate-700/80 rounded-full group-hover:border-slate-900 transition" />
          </div>
        </div>

        {/* Card 4: Exam / Question Paper */}
        <div
          id="template-card-exam-questions"
          onClick={() => onSelectTemplate('exam-questions')}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Exam Paper</h3>
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium font-nastaliq">امتحانی پرچہ</span>
          </div>

          <div className="flex justify-center items-end pb-1">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#ede9fe] flex items-center justify-center text-[#6366f1] group-hover:scale-110 transition-transform shadow-xs">
              <GraduationCap className="w-6 sm:w-7 h-6 sm:h-7 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* Card 5: Urdu Script */}
        <div
          id="template-card-urdu-script"
          onClick={() => onSelectTemplate('urdu-script')}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Urdu Script</h3>
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium font-nastaliq">ڈراما و سکرپٹ</span>
          </div>

          <div className="flex justify-center items-end pb-1">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#ede9fe] flex items-center justify-center text-[#6366f1] group-hover:scale-110 transition-transform shadow-xs">
              <Film className="w-5 sm:w-6 h-5 sm:h-6 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* Card 6: Custom Size */}
        <div
          id="template-card-custom-size"
          onClick={onOpenCustomSize}
          className="group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-40 sm:h-44"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Custom Size</h3>
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium font-nastaliq">سائز منتخب کریں</span>
          </div>

          <div className="flex justify-center items-end pb-1">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#ede9fe] flex items-center justify-center text-[#6366f1] group-hover:scale-110 transition-transform shadow-xs">
              <Maximize2 className="w-5 sm:w-6 h-5 sm:h-6 stroke-[1.75]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
