import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Feather,
  Sparkles,
  Search,
  Plus,
  Copy,
  Check,
  AlignJustify,
  SlidersHorizontal,
  PenTool,
  Quote,
  Flame,
  Heart,
  Compass,
  Play
} from 'lucide-react';
import {
  PoetryItem,
  PoetryLayoutStyle,
  URDU_POETRY_COLLECTION,
  ENGLISH_POETRY_COLLECTION,
  generatePoetryHtml
} from '../data/poetryData';

interface PoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPoetry: (html: string, options?: { animateTypewriter?: boolean; textLines?: string[] }) => void;
  onShowToast: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
}

export const PoetryModal: React.FC<PoetryModalProps> = ({
  isOpen,
  onClose,
  onInsertPoetry,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'urdu' | 'english' | 'custom'>('urdu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoetFilter, setSelectedPoetFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Composer State
  const [customLanguage, setCustomLanguage] = useState<'urdu' | 'english'>('urdu');
  const [customTitle, setCustomTitle] = useState('');
  const [customMisra1, setCustomMisra1] = useState('ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے');
  const [customMisra2, setCustomMisra2] = useState('بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے');
  const [customFreeformLines, setCustomFreeformLines] = useState('');
  const [isFreeformMode, setIsFreeformMode] = useState(false);
  const [customPoet, setCustomPoet] = useState('مرزا اسد اللہ خاں غالب');
  const [customLayoutStyle, setCustomLayoutStyle] = useState<PoetryLayoutStyle>('classic-center');
  const [customFont, setCustomFont] = useState('font-nastaliq');

  // Filtered Urdu list
  const filteredUrduPoetry = useMemo(() => {
    return URDU_POETRY_COLLECTION.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.poet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.titleUrdu && item.titleUrdu.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.lines.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPoet = selectedPoetFilter === 'all' || item.poet === selectedPoetFilter;
      const matchesCategory =
        selectedCategoryFilter === 'all' || item.categoryUrdu === selectedCategoryFilter;

      return matchesSearch && matchesPoet && matchesCategory;
    });
  }, [searchQuery, selectedPoetFilter, selectedCategoryFilter]);

  // Filtered English list
  const filteredEnglishPoetry = useMemo(() => {
    return ENGLISH_POETRY_COLLECTION.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.poet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.lines.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPoet = selectedPoetFilter === 'all' || item.poet === selectedPoetFilter;
      const matchesCategory =
        selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

      return matchesSearch && matchesPoet && matchesCategory;
    });
  }, [searchQuery, selectedPoetFilter, selectedCategoryFilter]);

  // Handle direct 1-click insert from collection
  const handleInsertCollectionItem = (
    item: PoetryItem,
    layoutStyle: PoetryLayoutStyle = 'classic-center',
    animate = false
  ) => {
    const html = generatePoetryHtml({
      title: item.language === 'urdu' ? item.titleUrdu : item.title,
      lines: item.lines,
      poet: item.language === 'urdu' ? item.poet : item.poet,
      language: item.language,
      layoutStyle,
      fontClass: item.suggestedFont || (item.language === 'urdu' ? 'font-nastaliq' : 'font-playfair')
    });

    onInsertPoetry(html, {
      animateTypewriter: animate,
      textLines: item.lines
    });

    onShowToast({
      type: 'success',
      title: item.language === 'urdu' ? 'شاعری صفحہ پر لکھ دی گئی!' : 'Poetry Written on Page!',
      description: item.language === 'urdu' ? `کلام: ${item.poet}` : `Poem by: ${item.poet}`
    });

    onClose();
  };

  // Handle custom composition insert
  const handleInsertCustom = (animate = false) => {
    const lines = isFreeformMode
      ? customFreeformLines.split('\n').filter((l) => l.trim().length > 0)
      : [customMisra1.trim(), customMisra2.trim()].filter(Boolean);

    if (lines.length === 0) {
      onShowToast({
        type: 'error',
        title: 'تحریر درج کریں',
        description: 'براہ کرم کم از کم ایک مصرع یا شعر کی سطر لکھیں۔'
      });
      return;
    }

    const html = generatePoetryHtml({
      title: customTitle,
      lines,
      poet: customPoet,
      language: customLanguage,
      layoutStyle: customLayoutStyle,
      fontClass: customFont
    });

    onInsertPoetry(html, {
      animateTypewriter: animate,
      textLines: lines
    });

    onShowToast({
      type: 'success',
      title: customLanguage === 'urdu' ? 'شاعری صفحہ پر درج ہو گئی!' : 'Poetry Written on Page!',
      description: customPoet ? `شاعر: ${customPoet}` : 'خوبصورت انداز میں شامل کر دیا گیا ہے۔'
    });

    onClose();
  };

  // Copy plain text
  const handleCopyText = (item: PoetryItem) => {
    const text = `${item.lines.join('\n')}\n— ${item.poet}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast({
      type: 'info',
      title: 'متن کاپی ہو گیا (Copied)',
      description: item.poet
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-6 overflow-hidden flex flex-col max-h-[92vh] border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-xs">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg font-nastaliq leading-tight">
                  شاعری اور غزل کمپوزر
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                  Urdu & English Poetry
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                اردو اور انگریزی کی خوبصورت شاعری 1-کلک میں اپنے صفحے پر درج کریں یا اپنی تحریر لکھیں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition"
            title="بند کریں (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 pt-3 pb-1 border-b border-gray-100 shrink-0">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('urdu');
                setSelectedPoetFilter('all');
                setSelectedCategoryFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                activeTab === 'urdu'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
              }`}
            >
              <span>🇵🇰</span>
              <span className="font-nastaliq">اردو شاعری (Urdu)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('english');
                setSelectedPoetFilter('all');
                setSelectedCategoryFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                activeTab === 'english'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
              }`}
            >
              <span>🇬🇧</span>
              <span>English Poetry</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                activeTab === 'custom'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>اپنی شاعری لکھیں (Write)</span>
            </button>
          </div>

          {activeTab !== 'custom' && (
            <div className="relative hidden sm:block w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'urdu' ? 'شعر یا شاعر تلاش کریں...' : 'Search poem or poet...'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          {/* TAB 1: URDU POETRY LIBRARY */}
          {activeTab === 'urdu' && (
            <div className="space-y-3">
              {/* Quick Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-gray-400 text-[11px] shrink-0 font-medium">شعراء:</span>
                {[
                  'all',
                  'علامہ محمد اقبال',
                  'مرزا اسد اللہ خاں غالب',
                  'فیض احمد فیض',
                  'جون ایلیا',
                  'احمد فراز',
                  'پروین شاکر',
                  'میر تقی میر'
                ].map((poet) => (
                  <button
                    key={poet}
                    onClick={() => setSelectedPoetFilter(poet)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                      selectedPoetFilter === poet
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {poet === 'all' ? 'تمام شعراء (All)' : poet}
                  </button>
                ))}
              </div>

              {/* Grid of Urdu Couplets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredUrduPoetry.map((item) => {
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="bg-white hover:bg-emerald-50/20 border border-gray-200 hover:border-emerald-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between gap-3"
                    >
                      <div dir="rtl" className="text-right">
                        {/* Poet & Category Badges */}
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-gray-100">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {item.poet}
                          </span>
                          <span className="text-gray-400 font-medium">{item.categoryUrdu}</span>
                        </div>

                        {/* Couplet Verses */}
                        <div className="py-3 px-2 text-center bg-gray-50/60 rounded-lg my-2 border border-gray-100 font-nastaliq">
                          <p className="text-base sm:text-lg text-gray-900 font-semibold leading-loose">
                            {item.lines[0]}
                          </p>
                          <p className="text-base sm:text-lg text-gray-900 font-semibold leading-loose mt-0.5">
                            {item.lines[1]}
                          </p>
                        </div>
                      </div>

                      {/* Insertion Controls */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                        {/* Quick Insert on Page */}
                        <button
                          type="button"
                          onClick={() => handleInsertCollectionItem(item, 'classic-center')}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg transition shadow-2xs active:scale-98 cursor-pointer"
                          title="صفحہ پر درج کریں (Insert on Page)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="font-nastaliq text-xs">صفحہ پر لکھیں (Insert)</span>
                        </button>

                        {/* Animated Typewriter Effect */}
                        <button
                          type="button"
                          onClick={() => handleInsertCollectionItem(item, 'classic-center', true)}
                          className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="لائیو ٹائپ رائٹر انداز میں لکھیں (Typewriter effect)"
                        >
                          <Play className="w-3 h-3 text-cyan-600" />
                          <span className="hidden sm:inline text-[11px]">ٹائپ رائٹر</span>
                        </button>

                        {/* Copy Text */}
                        <button
                          type="button"
                          onClick={() => handleCopyText(item)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                          title="کاپی کریں (Copy)"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ENGLISH POETRY LIBRARY */}
          {activeTab === 'english' && (
            <div className="space-y-3">
              {/* Quick Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-gray-400 text-[11px] shrink-0 font-medium">Poets:</span>
                {[
                  'all',
                  'William Shakespeare',
                  'Robert Frost',
                  'William Wordsworth',
                  'Emily Dickinson',
                  'John Keats',
                  'Mawlana Jalaluddin Rumi',
                  'Percy Bysshe Shelley',
                  'Maya Angelou'
                ].map((poet) => (
                  <button
                    key={poet}
                    onClick={() => setSelectedPoetFilter(poet)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                      selectedPoetFilter === poet
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {poet === 'all' ? 'All Poets' : poet}
                  </button>
                ))}
              </div>

              {/* Grid of English Poems */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredEnglishPoetry.map((item) => {
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="bg-white hover:bg-blue-50/20 border border-gray-200 hover:border-blue-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between gap-3"
                    >
                      <div>
                        {/* Title & Poet Header */}
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-gray-100">
                          <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {item.poet}
                          </span>
                          <span className="text-gray-500 font-medium">{item.category}</span>
                        </div>

                        {item.title && (
                          <p className="text-xs font-bold text-gray-800 mt-2 font-serif">
                            {item.title}
                          </p>
                        )}

                        {/* Poem Verses */}
                        <div className="py-3 px-3 bg-gray-50/60 rounded-lg my-2 border border-gray-100 font-playfair text-center">
                          {item.lines.map((line, idx) => (
                            <p
                              key={idx}
                              className="text-xs sm:text-sm text-gray-900 font-medium leading-relaxed italic"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Insertion Controls */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                        {/* Quick Insert on Page */}
                        <button
                          type="button"
                          onClick={() => handleInsertCollectionItem(item, 'classic-center')}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition shadow-2xs active:scale-98 cursor-pointer"
                          title="Insert on Document Page"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Write on Page</span>
                        </button>

                        {/* Animated Typewriter Effect */}
                        <button
                          type="button"
                          onClick={() => handleInsertCollectionItem(item, 'classic-center', true)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Typewriter effect onto page"
                        >
                          <Play className="w-3 h-3 text-indigo-600" />
                          <span className="hidden sm:inline text-[11px]">Typewriter</span>
                        </button>

                        {/* Copy Text */}
                        <button
                          type="button"
                          onClick={() => handleCopyText(item)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                          title="Copy text"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM POETRY COMPOSER */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    کسٹم شاعری اسٹوڈیو (Compose Custom Poem)
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    اپنا کلام لکھیں، خوبصورت فارمیٹ منتخب کریں اور ایک کلک میں اپنے صفحے پر ٹائپ کریں
                  </p>
                </div>

                {/* Urdu vs English Toggle */}
                <div className="flex items-center bg-white p-0.5 rounded-lg border border-amber-300">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLanguage('urdu');
                      setCustomFont('font-nastaliq');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                      customLanguage === 'urdu'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🇵🇰 اردو
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLanguage('english');
                      setCustomFont('font-playfair');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                      customLanguage === 'english'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              {/* Composition Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs Column */}
                <div className="space-y-3">
                  {/* Title (Optional) */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {customLanguage === 'urdu' ? 'عنوان (Title - اختیاری):' : 'Poem Title (Optional):'}
                    </label>
                    <input
                      type="text"
                      dir={customLanguage === 'urdu' ? 'rtl' : 'ltr'}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder={customLanguage === 'urdu' ? 'مثلاً: جذبۂ عشق' : 'e.g. Whispers of the Heart'}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Mode switcher: Couplet (شعر) vs Multi-line Stanza (نظم/بند) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-gray-700">
                      {customLanguage === 'urdu' ? 'شعر کا متن:' : 'Poetry Verses:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFreeformMode(!isFreeformMode)}
                      className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold underline"
                    >
                      {isFreeformMode
                        ? (customLanguage === 'urdu' ? 'دو سطری شعر (Couplet Mode)' : 'Couplet Mode')
                        : (customLanguage === 'urdu' ? 'کثیر السطور نظم (Multi-line Stanza)' : 'Multi-line Stanza')}
                    </button>
                  </div>

                  {!isFreeformMode ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-500 block mb-0.5">
                          {customLanguage === 'urdu' ? 'مصرعِ اولیٰ (First Verse):' : 'Line 1:'}
                        </span>
                        <input
                          type="text"
                          dir={customLanguage === 'urdu' ? 'rtl' : 'ltr'}
                          value={customMisra1}
                          onChange={(e) => setCustomMisra1(e.target.value)}
                          placeholder={customLanguage === 'urdu' ? 'پہلا مصرع لکھیں...' : 'First line...'}
                          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold ${
                            customLanguage === 'urdu' ? 'font-nastaliq leading-relaxed' : ''
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block mb-0.5">
                          {customLanguage === 'urdu' ? 'مصرعِ ثانیہ (Second Verse):' : 'Line 2:'}
                        </span>
                        <input
                          type="text"
                          dir={customLanguage === 'urdu' ? 'rtl' : 'ltr'}
                          value={customMisra2}
                          onChange={(e) => setCustomMisra2(e.target.value)}
                          placeholder={customLanguage === 'urdu' ? 'دوسرا مصرع لکھیں...' : 'Second line...'}
                          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold ${
                            customLanguage === 'urdu' ? 'font-nastaliq leading-relaxed' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        rows={4}
                        dir={customLanguage === 'urdu' ? 'rtl' : 'ltr'}
                        value={customFreeformLines}
                        onChange={(e) => setCustomFreeformLines(e.target.value)}
                        placeholder={
                          customLanguage === 'urdu'
                            ? 'ہر سطر میں ایک مصرع لکھیں...'
                            : 'Write verses, one line per verse...'
                        }
                        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold ${
                          customLanguage === 'urdu' ? 'font-nastaliq leading-loose' : ''
                        }`}
                      />
                    </div>
                  )}

                  {/* Poet Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {customLanguage === 'urdu' ? 'شاعر / تخلص:' : 'Poet Name / Signature:'}
                    </label>
                    <input
                      type="text"
                      dir={customLanguage === 'urdu' ? 'rtl' : 'ltr'}
                      value={customPoet}
                      onChange={(e) => setCustomPoet(e.target.value)}
                      placeholder={customLanguage === 'urdu' ? 'مثلاً: مرزا اسد اللہ خاں غالب' : 'e.g. Robert Frost'}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Layout Style & Font Controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        انداز (Layout):
                      </label>
                      <select
                        value={customLayoutStyle}
                        onChange={(e) => setCustomLayoutStyle(e.target.value as PoetryLayoutStyle)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="classic-center">Classic Centered (روایتی)</option>
                        <option value="two-column">Side-by-Side (دو کالمی)</option>
                        <option value="quoted-card">Framed Card (فریم کارڈ)</option>
                        <option value="stanza">Stanza / بند (آزاد)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        فونٹ (Font):
                      </label>
                      <select
                        value={customFont}
                        onChange={(e) => setCustomFont(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {customLanguage === 'urdu' ? (
                          <>
                            <option value="font-nastaliq">نستعلیق کلاسیک</option>
                            <option value="font-gulzar">گلزار خطاطی</option>
                            <option value="font-lateef">لطیف خوشخط</option>
                            <option value="font-scheherazade">شہرزاد روایتی</option>
                            <option value="font-amiri">امیری نسخ</option>
                          </>
                        ) : (
                          <>
                            <option value="font-playfair">Playfair Display (Serif)</option>
                            <option value="font-great-vibes">Great Vibes (Calligraphy)</option>
                            <option value="font-dancing">Dancing Script</option>
                            <option value="font-cinzel">Cinzel (Royal Roman)</option>
                            <option value="font-montserrat">Montserrat (Clean)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Preview Column */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700 block mb-1 flex items-center justify-between">
                    <span>لائیو پیش نظارہ (Live Sheet Preview):</span>
                    <span className="text-[10px] text-gray-400">Exact layout on paper</span>
                  </span>

                  <div className="flex-1 min-h-[220px] bg-white border border-gray-200 rounded-xl p-4 shadow-inner flex flex-col items-center justify-center overflow-hidden">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generatePoetryHtml({
                          title: customTitle,
                          lines: isFreeformMode
                            ? customFreeformLines.split('\n').filter((l) => l.trim().length > 0)
                            : [customMisra1.trim(), customMisra2.trim()].filter(Boolean),
                          poet: customPoet,
                          language: customLanguage,
                          layoutStyle: customLayoutStyle,
                          fontClass: customFont
                        })
                      }}
                      className="w-full max-w-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons for Custom */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleInsertCustom(false)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:from-emerald-800 active:to-teal-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>صفحہ پر لکھیں (Write on Page)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInsertCustom(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                  title="ٹائپ رائٹر انداز میں لکھیں"
                >
                  <Play className="w-4 h-4" />
                  <span>لائیو ٹائپ رائٹر (Animated Typewriter)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <span>💡 کلک کرتے ہی شاعری براہِ راست آپ کے صفحے پر پرنٹ ہو جائے گی جہاں آپ مزید ترمیم بھی کر سکتے ہیں۔</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
