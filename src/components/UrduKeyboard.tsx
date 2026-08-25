import React, { useState } from 'react';
import { X, CornerDownLeft, Sparkles, BookOpen, Hash, ArrowLeft } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'alphabet' | 'phonetic' | 'compound' | 'symbols'>('alphabet');

  if (!isOpen) return null;

  // Complete Urdu Alphabets in strict, clean alphabetical order
  const alphabeticalRows = [
    // Row 1: Alif to Khey
    ['ا', 'آ', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ'],
    // Row 2: Daal to Zhey
    ['د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض'],
    // Row 3: Toey to Gaf
    ['ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن'],
    // Row 4: Noon Ghunna to Barri Ye
    ['ں', 'و', 'ؤ', 'ہ', 'ھ', 'ء', 'ئ', 'ی', 'ے', 'ۃ', 'ـ' /* Tatweel / Kashida */]
  ];

  // Phonetic standard keyboard layout (familiar layout)
  const phoneticRows = [
    // Row 1: Numbers & basic marks
    ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', 'َ', 'ِ', 'ُ', 'ّ', 'ْ', 'ٓ'],
    // Row 2
    ['ق', 'و', 'ع', 'غ', 'ر', 'ڑ', 'ت', 'ٹ', 'ے', 'ی', 'ء', 'پ', 'ہ', 'ھ', 'خ', 'ح'],
    // Row 3
    ['ا', 'آ', 'س', 'ش', 'د', 'ڈ', 'ذ', 'ف', 'گ', 'ک', 'ل', 'م', 'ن', 'ں', 'ص', 'ض'],
    // Row 4
    ['ط', 'ظ', 'ز', 'ژ', 'ث', 'ج', 'چ', '،', '۔', '؟', '؛', '!', '«', '»', 'ـ']
  ];

  // Compound (دو چشمی مرکب حروف) & Islamic Calligraphy
  const compoundAndIslamic = [
    // Do Chashmi letters
    ['بھ', 'پھ', 'تھ', 'ٹھ', 'جھ', 'چھ', 'دھ', 'ڈھ', 'رھ', 'ڑھ', 'کھ', 'گھ', 'لھ', 'مھ', 'نھ'],
    // Islamic honorific symbols
    ['﷽', 'ﷺ', 'ﷻ', 'ؑ', 'ؓ', 'ؒ', 'تعالیٰ', 'رحمتہ اللہ', 'عزوجل', 'رضی اللہ عنہ', 'علیہ السلام', 'صلی اللہ علیہ وسلم'],
    // Quranic & poetic accents
    ['﴾ ﴿', '« »', '—', '٭', '؏', '؀', '؁', '؂', '؎', '؛', '،', '۔', '؟', '٪']
  ];

  // Diacritics & Numbers
  const diacriticsAndSymbols = [
    // Complete Diacritics (اعراب)
    [
      { char: 'َ', name: 'زبر (Fatha)' },
      { char: 'ِ', name: 'زیر (Kasra)' },
      { char: 'ُ', name: 'پیش (Damma)' },
      { char: 'ً', name: 'دو زبر (Tanween Fath)' },
      { char: 'ٍ', name: 'دو زیر (Tanween Kasr)' },
      { char: 'ٌ', name: 'دو پیش (Tanween Damm)' },
      { char: 'ّ', name: 'تشدید (Shaddah)' },
      { char: 'ْ', name: 'سکون/جزم (Sukun)' },
      { char: 'ٓ', name: 'مد (Maddah)' },
      { char: 'ٰ', name: 'کھڑا زبر (Dagger Alif)' },
      { char: 'ٖ', name: 'کھڑی زیر (Subscript Alif)' },
      { char: 'ٔ', name: 'ہمزہ اوپر (Hamza Above)' }
    ],
    // Urdu Numerals
    [
      { char: '۰', name: '0' },
      { char: '۱', name: '1' },
      { char: '۲', name: '2' },
      { char: '۳', name: '3' },
      { char: '۴', name: '4' },
      { char: '۵', name: '5' },
      { char: '۶', name: '6' },
      { char: '۷', name: '7' },
      { char: '۸', name: '8' },
      { char: '۹', name: '9' }
    ]
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/98 text-white border-t border-gray-700 shadow-2xl p-2.5 sm:p-4 backdrop-blur-lg animate-in slide-in-from-bottom duration-200">
      <div className="max-w-5xl mx-auto">
        {/* Keyboard Header & Tab Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-amber-400 font-nastaliq text-base sm:text-lg flex items-center gap-1">
              <span>اردو کی بورڈ</span>
            </span>

            {/* View tabs */}
            <div className="flex items-center bg-gray-800/90 rounded-lg p-0.5 border border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab('alphabet')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                  activeTab === 'alphabet'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>حروفِ تہجی (الف تا ے)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('phonetic')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'phonetic'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <span>فونیٹک لے آؤٹ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('compound')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                  activeTab === 'compound'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>مرکب حروف و خطاطی</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('symbols')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                  activeTab === 'symbols'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>اعراب و اعداد</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition"
              title="کی بورڈ بند کریں (Close keyboard)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className="space-y-1.5 direction-rtl" style={{ direction: 'rtl' }}>
          {/* TAB 1: Complete Alphabetical Order */}
          {activeTab === 'alphabet' && (
            <div className="space-y-1.5">
              {alphabeticalRows.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {row.map((ch, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => onInsertChar(ch)}
                      className={`font-nastaliq text-lg sm:text-xl min-w-[34px] sm:min-w-[44px] h-9 sm:h-10 rounded-lg border transition shadow-xs select-none active:scale-95 flex items-center justify-center ${
                        ch === 'ـ'
                          ? 'bg-amber-700/80 hover:bg-amber-600 border-amber-500/80 text-white'
                          : 'bg-gray-800/90 hover:bg-amber-600 text-white border-gray-700 hover:border-amber-400'
                      }`}
                      title={ch === 'ـ' ? 'کشیدہ / لمبی کشش (Tatweel)' : ch}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Phonetic Standard Layout */}
          {activeTab === 'phonetic' && (
            <div className="space-y-1.5">
              {phoneticRows.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {row.map((ch, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => onInsertChar(ch)}
                      className="font-nastaliq text-base sm:text-lg min-w-[30px] sm:min-w-[40px] h-8 sm:h-9 bg-gray-800/90 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg border border-gray-700 hover:border-amber-400 flex items-center justify-center transition shadow-xs select-none active:scale-95"
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Compound Letters & Islamic Calligraphy */}
          {activeTab === 'compound' && (
            <div className="space-y-2 py-1">
              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
                {compoundAndIslamic[0].map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInsertChar(ch)}
                    className="font-nastaliq text-lg sm:text-xl px-2.5 min-w-[42px] h-9 sm:h-10 bg-gray-800 hover:bg-amber-600 text-white rounded-lg border border-gray-700 hover:border-amber-400 flex items-center justify-center transition shadow-xs active:scale-95"
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap pt-1 border-t border-gray-800">
                {compoundAndIslamic[1].map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInsertChar(phrase + ' ')}
                    className="font-nastaliq text-base px-3 py-1 bg-amber-950/40 hover:bg-amber-600 text-amber-200 hover:text-white rounded-lg border border-amber-700/50 hover:border-amber-400 flex items-center justify-center transition shadow-xs active:scale-95"
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap pt-1 border-t border-gray-800">
                {compoundAndIslamic[2].map((sym, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInsertChar(sym)}
                    className="font-nastaliq text-base min-w-[36px] px-2 h-8 bg-gray-800 hover:bg-amber-600 text-white rounded-lg border border-gray-700 flex items-center justify-center transition shadow-xs active:scale-95"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Diacritics & Numbers */}
          {activeTab === 'symbols' && (
            <div className="space-y-2 py-1">
              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
                {diacriticsAndSymbols[0].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInsertChar(item.char)}
                    className="flex flex-col items-center justify-center px-2 py-1 min-w-[42px] h-12 bg-gray-800 hover:bg-amber-600 text-white rounded-lg border border-gray-700 hover:border-amber-400 transition shadow-xs active:scale-95"
                    title={item.name}
                  >
                    <span className="font-nastaliq text-2xl font-bold leading-none">ت{item.char}</span>
                    <span className="text-[9px] text-gray-400 hover:text-white font-sans mt-0.5">
                      {item.char}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap pt-1 border-t border-gray-800">
                {diacriticsAndSymbols[1].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInsertChar(item.char)}
                    className="font-nastaliq text-xl min-w-[36px] sm:min-w-[44px] h-9 sm:h-10 bg-gray-800 hover:bg-amber-600 text-white rounded-lg border border-gray-700 flex items-center justify-center transition shadow-xs active:scale-95"
                    title={`نمبر ${item.name}`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Control Bar: Quick helpers, Space, Enter, Kashida, Backspace */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
            {/* Quick Kashida / Tatweel Button */}
            <button
              type="button"
              onClick={() => onInsertChar('ـ')}
              className="px-3 h-8 sm:h-9 bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-nastaliq text-sm rounded-lg border border-amber-600/70 flex items-center justify-center gap-1 transition shadow-xs"
              title="کشیدہ (لمبی کشش - Tatweel)"
            >
              <span>کشیدہ (ـ)</span>
            </button>

            {/* Quick Khatma (۔) */}
            <button
              type="button"
              onClick={() => onInsertChar('۔')}
              className="px-3 h-8 sm:h-9 bg-gray-800 hover:bg-gray-700 text-white font-nastaliq text-base rounded-lg border border-gray-700 flex items-center justify-center transition"
              title="ختمہ / فل اسٹاپ"
            >
              <span>۔ (ختمہ)</span>
            </button>

            {/* Quick Comma (،) */}
            <button
              type="button"
              onClick={() => onInsertChar('،')}
              className="px-3 h-8 sm:h-9 bg-gray-800 hover:bg-gray-700 text-white font-nastaliq text-base rounded-lg border border-gray-700 flex items-center justify-center transition"
              title="سکتہ / کوما"
            >
              <span>، (سکتہ)</span>
            </button>

            {/* Space Bar */}
            <button
              type="button"
              onClick={() => onInsertChar(' ')}
              className="flex-1 max-w-sm h-8 sm:h-9 bg-gray-800 hover:bg-amber-600 text-white font-medium text-xs rounded-lg border border-gray-700 flex items-center justify-center transition shadow-xs active:scale-98"
            >
              فاصلہ (Space)
            </button>

            {/* Enter Key */}
            <button
              type="button"
              onClick={() => onInsertChar('\n')}
              className="px-3 sm:px-4 h-8 sm:h-9 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg shadow-xs flex items-center justify-center gap-1 transition active:scale-95"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">نئی سطر (Enter)</span>
              <span className="sm:hidden">Enter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
