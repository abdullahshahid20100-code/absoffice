import React, { useState, useEffect } from 'react';
import {
  X,
  Languages,
  Sparkles,
  ArrowRightLeft,
  Check,
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  AlignRight,
  AlignLeft,
  Wand2
} from 'lucide-react';

export type TranslationMode = 'auto' | 'urdu_to_english' | 'english_to_urdu' | 'correct_only';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceText: string;
  isSelectionScope: boolean;
  onApply: (translatedText: string, targetDirection: 'ltr' | 'rtl', targetFont?: string) => void;
  lang?: 'urdu' | 'english';
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  sourceText,
  isSelectionScope,
  onApply,
  lang = 'urdu'
}) => {
  const isUrdu = lang === 'urdu';
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<TranslationMode>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    text: string;
    detectedLanguage: string;
    targetLanguage: string;
    summary: string;
    direction: 'ltr' | 'rtl';
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Synchronize initial input text when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputText(sourceText);
      setResult(null);
      setError(null);
      setIsCopied(false);
    }
  }, [isOpen, sourceText]);

  if (!isOpen) return null;

  const handleTranslate = async (overrideMode?: TranslationMode) => {
    const activeMode = overrideMode || mode;
    const textToProcess = inputText.trim();
    if (!textToProcess) {
      setError(isUrdu ? 'برائے مہربانی ترجمہ یا درستی کے لیے تحریر درج کریں' : 'Please enter text to translate or correct');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate-correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          mode: activeMode,
          preserveHtml: textToProcess.includes('<') && textToProcess.includes('>')
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      const resData = data.data;
      const targetDir: 'ltr' | 'rtl' =
        resData.direction === 'rtl' || resData.targetLanguage === 'Urdu' || /[\u0600-\u06FF]/.test(resData.result)
          ? 'rtl'
          : 'ltr';

      setResult({
        text: resData.result,
        detectedLanguage: resData.detectedLanguage,
        targetLanguage: resData.targetLanguage,
        summary: resData.summary,
        direction: targetDir
      });
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err?.message || (isUrdu ? 'ترجمہ کرنے میں دشواری پیش آئی، دوبارہ کوشش کریں۔' : 'Failed to translate and correct. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (!result) return;
    const targetFont = result.direction === 'rtl' ? 'font-nastaliq' : 'font-sans-custom';
    onApply(result.text, result.direction, targetFont);
    onClose();
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text.replace(/<[^>]+>/g, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>{isUrdu ? 'اردو ⇄ انگلش ترجمہ و خودکار درستی' : 'Urdu ⇄ English Translate & Auto Correct'}</span>
                <span className="text-2xs bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3" />
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {isUrdu
                  ? 'اردو کو انگریزی اور انگریزی کو اردو میں تبدیل کریں اور املا و گرامر درست کروائیں'
                  : 'Convert Urdu to English or English to Urdu with automatic grammar & spelling correction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white/80 rounded-xl transition"
            title={isUrdu ? 'بند کریں' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-gray-100 bg-gray-50/70 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('auto');
                handleTranslate('auto');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                mode === 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? '⚡ خودکار ترجمہ و تصحیح (Auto)' : '⚡ Auto Detect & Correct'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('urdu_to_english');
                handleTranslate('urdu_to_english');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                mode === 'urdu_to_english'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>🇵🇰 ➔ 🇬🇧</span>
              <span>{isUrdu ? 'اردو سے انگریزی' : 'Urdu to English'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('english_to_urdu');
                handleTranslate('english_to_urdu');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                mode === 'english_to_urdu'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>🇬🇧 ➔ 🇵🇰</span>
              <span>{isUrdu ? 'انگریزی سے اردو' : 'English to Urdu'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('correct_only');
                handleTranslate('correct_only');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                mode === 'correct_only'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'صرف املا و گرامر درست کریں' : 'Proofread & Correct'}</span>
            </button>
          </div>

          {isSelectionScope && (
            <span className="text-2xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {isUrdu ? 'منتخب تحریر پر لاگو ہوگا' : 'Applying to selected text'}
            </span>
          )}
        </div>

        {/* Body / Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid Layout: Input on Left/Top, Output on Right/Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Side */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span>{isUrdu ? 'اصل تحریر (Original Text)' : 'Original Text'}</span>
                  {inputText && /[\u0600-\u06FF]/.test(inputText) ? (
                    <span className="text-2xs font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">اردو</span>
                  ) : (
                    <span className="text-2xs font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">English</span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-2xs text-gray-500 hover:text-red-600 transition"
                >
                  {isUrdu ? 'صاف کریں' : 'Clear'}
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'یہاں اپنی تحریر لکھیں یا پیسٹ کریں (اردو یا انگلش)...'
                    : 'Type or paste your text here (in Urdu or English)...'
                }
                dir="auto"
                rows={7}
                className="w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-2xs font-nastaliq leading-relaxed transition"
              />

              <div className="mt-2.5 flex items-center justify-between text-2xs text-gray-500">
                <span>{inputText.length} {isUrdu ? 'حروف' : 'characters'}</span>
                <button
                  type="button"
                  disabled={isLoading || !inputText.trim()}
                  onClick={() => handleTranslate()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isUrdu ? 'ترجمہ ہو رہا ہے...' : 'Translating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isUrdu ? '⚡ ترجمہ اور درستی کریں' : '⚡ Translate & Correct'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Side */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span>{isUrdu ? 'ترجمہ شدہ اور درست تحریر' : 'Translated & Corrected Text'}</span>
                  {result && (
                    <span className="text-2xs font-normal text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                      {result.targetLanguage}
                    </span>
                  )}
                </label>

                {result && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-2xs text-gray-600 hover:text-blue-600 flex items-center gap-1 transition px-1.5 py-0.5 rounded hover:bg-gray-100"
                      title={isUrdu ? 'کاپی کریں' : 'Copy'}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? (isUrdu ? 'کاپی ہو گیا' : 'Copied!') : (isUrdu ? 'کاپی' : 'Copy')}</span>
                    </button>
                  </div>
                )}
              </div>

              <div
                dir={result ? result.direction : 'auto'}
                className={`w-full p-3.5 border rounded-xl min-h-[175px] max-h-[260px] overflow-y-auto transition ${
                  isLoading
                    ? 'bg-blue-50/40 border-blue-200 flex flex-col items-center justify-center text-center p-6'
                    : result
                    ? 'bg-emerald-50/30 border-emerald-300 text-gray-900 shadow-2xs'
                    : 'bg-gray-50 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6 text-gray-400'
                } ${result?.direction === 'rtl' ? 'font-nastaliq leading-loose text-base sm:text-lg' : 'font-sans-custom leading-relaxed text-sm sm:text-base'}`}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <p className="text-xs sm:text-sm font-semibold">
                      {isUrdu ? 'Gemini AI سے ترجمہ اور املا کی درستی جاری ہے...' : 'AI is translating and correcting grammar...'}
                    </p>
                    <p className="text-2xs text-gray-500">
                      {isUrdu ? 'جملے کی بناوٹ اور گرائمر کو خودکار ٹھیک کیا جا رہا ہے' : 'Refining sentence structure and vocabulary'}
                    </p>
                  </div>
                ) : result ? (
                  <div className="whitespace-pre-wrap select-text">{result.text}</div>
                ) : (
                  <div className="space-y-1">
                    <Languages className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-xs font-medium">
                      {isUrdu ? 'ترجمہ شدہ اور درست تحریر یہاں دکھائی دے گی' : 'Translated & corrected text will appear here'}
                    </p>
                    <p className="text-2xs text-gray-400">
                      {isUrdu ? 'اوپر بٹن پر کلک کر کے فوری ترجمہ کریں' : 'Click the translate button above to start'}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary of corrections */}
              {result?.summary && (
                <div className="mt-2.5 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-2xs sm:text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{isUrdu ? 'خلاصہ و درستی: ' : 'Summary & Fixes: '}</span>
                    <span>{result.summary}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-2xs text-gray-500 flex items-center gap-2">
            <span>✨ {isUrdu ? 'خودکار طور پر Nastaliq اور انگریزی میں سیٹ ہو جائے گا' : 'Auto sets Nastaliq or English styling'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={!result || !result.text}
              onClick={handleApplyResult}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isUrdu ? 'ڈاکومنٹ میں لاگو کریں' : 'Apply to Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
