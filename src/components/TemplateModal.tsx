import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Film, FileText, Maximize2, MoveDiagonal2 } from 'lucide-react';
import { TemplateId } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (id: TemplateId) => void;
  onOpenCustomSize: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onOpenCustomSize
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 z-10 border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose a Template</h2>
              <p className="text-sm text-gray-500 mt-1">
                Start your next document with a pre-designed layout.
              </p>
            </div>

            <button
              id="btn-close-template-modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 6 Template Cards Grid: 2 per row on mobile, 2 on tablet, 3 on desktop */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {/* 1. Urdu Script / Screenplay */}
            <button
              id="modal-template-urdu-script"
              onClick={() => {
                onClose();
                onSelectTemplate('urdu-script');
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col items-center justify-center p-2 sm:p-3 relative group-hover:border-blue-400 transition">
                <div className="w-7 sm:w-10 h-5 sm:h-7 bg-gray-200 rounded border border-gray-300 flex items-center justify-center mb-1.5">
                  <div className="flex gap-1">
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-400 rounded-full" />
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <div className="w-full h-1 bg-gray-300 rounded" />
                  <div className="w-3/4 mx-auto h-1 bg-gray-300 rounded" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                Urdu Script
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Suspense & Thriller</p>
            </button>

            {/* 2. Formal Letter / App */}
            <button
              id="modal-template-formal-letter"
              onClick={() => {
                onClose();
                onSelectTemplate('formal-letter');
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col justify-between p-2 sm:p-3 relative group-hover:border-blue-400 transition">
                <div className="space-y-1">
                  <div className="w-6 sm:w-8 h-1 sm:h-2 bg-gray-800 rounded-xs self-end ml-auto" />
                  <div className="w-full h-0.5 sm:h-1 bg-gray-300 rounded" />
                  <div className="w-5/6 h-0.5 sm:h-1 bg-gray-300 rounded" />
                  <div className="w-full h-0.5 sm:h-1 bg-gray-300 rounded" />
                </div>
                <div className="w-4 sm:w-6 h-1 sm:h-1.5 bg-gray-400 rounded-xs ml-auto" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                Formal Letter
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">With clean frame</p>
            </button>

            {/* 3. Blank Document */}
            <button
              id="modal-template-blank"
              onClick={() => {
                onClose();
                onSelectTemplate('blank');
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-between p-1.5 sm:p-2 relative group-hover:border-blue-400 transition shadow-2xs">
                <div className="w-full h-full border border-gray-200 rounded-xs flex items-end justify-center pb-1">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono">1</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                Blank Document
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">A4 with border</p>
            </button>

            {/* 4. Poetry & Ghazal */}
            <button
              id="modal-template-poetry"
              onClick={() => {
                onClose();
                onSelectTemplate('poetry');
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col items-center justify-center p-2 sm:p-3 relative group-hover:border-blue-400 transition">
                <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-gray-500 rounded-full mb-2 sm:mb-3 shadow-2xs" />
                <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-gray-500 rounded-full shadow-2xs" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                Poetry & Ghazal
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">شاعری و غزل</p>
            </button>

            {/* 5. Exam / Question Paper (پرچہ امتحانی) */}
            <button
              id="modal-template-exam-questions"
              onClick={() => {
                onClose();
                onSelectTemplate('exam-questions');
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-emerald-50 border border-emerald-300 rounded-lg flex flex-col justify-between p-2 sm:p-2.5 relative group-hover:border-emerald-500 transition">
                <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-emerald-700 mx-auto rounded" />
                <div className="space-y-1 my-auto">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full border border-emerald-500" />
                    <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-emerald-400 rounded" />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full border border-emerald-500" />
                    <div className="w-6 sm:w-10 h-0.5 sm:h-1 bg-emerald-400 rounded" />
                  </div>
                </div>
                <div className="w-9 sm:w-14 h-0.5 sm:h-1 bg-emerald-600 mx-auto rounded" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-emerald-600 transition">
                Exam Paper
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">MCQs & Questions</p>
            </button>

            {/* 6. Custom Size */}
            <button
              id="modal-template-custom-size"
              onClick={() => {
                onClose();
                onOpenCustomSize();
              }}
              className="flex flex-col items-center text-center p-3 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md bg-white hover:bg-blue-50/30 transition group"
            >
              <div className="w-16 sm:w-24 h-20 sm:h-30 mb-2 sm:mb-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-2 sm:p-3 relative group-hover:border-blue-400 transition">
                <MoveDiagonal2 className="w-5 h-5 sm:w-7 sm:h-7 text-gray-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                Custom Size
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Set dimensions</p>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
