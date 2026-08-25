import React from 'react';
import { X, Delete, CornerDownLeft } from 'lucide-react';

interface UrduKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
}

export const UrduKeyboard: React.FC<UrduKeyboardProps> = ({
  isOpen,
  onClose,
  onInsertChar
}) => {
  if (!isOpen) return null;

  const rows = [
    // Row 1: Numbers & Diacritics
    ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', 'َ' /* Zabar */, 'ِ' /* Zer */, 'ُ' /* Pesh */, 'ّ' /* Tashdeed */, 'ْ' /* Sukun */, 'ٓ' /* Madd */],
    // Row 2: Letters
    ['ق', 'و', 'ع', 'ر', 'ت', 'ٹ', 'ے', 'ی', 'ء', 'پ', 'ہ', 'ھ', 'خ', 'ح', 'ج', 'چ'],
    // Row 3: Letters
    ['ا', 'آ', 'س', 'ش', 'د', 'ڈ', 'ف', 'گ', 'ک', 'ل', 'م', 'ن', 'ں', 'ص', 'ض', 'ط', 'ظ'],
    // Row 4: Letters & Punctuation
    ['ذ', 'ز', 'ژ', 'ڑ', 'ث', '؟', '،', '۔', '؛', '!', '’', '‘', '”', '“', '—']
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 text-white border-t border-gray-700 shadow-2xl p-3 pb-6 sm:p-4 backdrop-blur-md transition-all">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-400">اردو کی بورڈ (Virtual Urdu Keyboard)</span>
            <span className="text-gray-400 hidden sm:inline text-[11px]">— Click any character to insert into your document</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded transition"
            title="Close keyboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 direction-rtl" style={{ direction: 'rtl' }}>
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
              {row.map((ch, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => onInsertChar(ch)}
                  className="font-nastaliq text-base sm:text-lg min-w-[28px] sm:min-w-[38px] h-8 sm:h-9 bg-gray-800 hover:bg-blue-600 active:bg-blue-700 text-white rounded-md border border-gray-700/80 flex items-center justify-center transition shadow-xs select-none"
                >
                  {ch}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row: Space & special actions */}
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={() => onInsertChar(' ')}
              className="flex-1 max-w-md h-8 sm:h-9 bg-gray-800 hover:bg-blue-600 text-white font-medium text-xs rounded-md border border-gray-700 flex items-center justify-center transition"
            >
              فاصلہ (Space)
            </button>
            <button
              onClick={() => onInsertChar('\n')}
              className="px-4 h-8 sm:h-9 bg-gray-800 hover:bg-blue-600 text-white font-medium text-xs rounded-md border border-gray-700 flex items-center justify-center gap-1 transition"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>نئی سطر (Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
