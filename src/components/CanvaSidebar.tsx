import React, { useState } from 'react';
import {
  LayoutTemplate,
  Shapes,
  Type,
  Feather,
  UploadCloud,
  Palette,
  Wrench,
  Keyboard,
  X,
  Plus,
  Sparkles,
  Search,
  Check,
  Undo,
  Redo,
  Hash,
  ChevronRight,
  Sliders,
  Maximize2,
  Paintbrush,
  CheckCircle2
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { DocumentTemplate } from '../types';
import { PAGE_COLORS, isColorDark } from './PageColorModal';
import {
  ALL_ELEMENTS,
  POPULAR_COLORS,
  ElementCategory,
  ShapeStyleMode,
  ElementItem
} from '../data/elementsData';

export type CanvaSidebarTab =
  | 'templates'
  | 'elements'
  | 'text'
  | 'poetry'
  | 'uploads'
  | 'tools'
  | 'page'
  | null;

interface CanvaSidebarProps {
  activeTab: CanvaSidebarTab;
  setActiveTab: (tab: CanvaSidebarTab) => void;
  onApplyTemplate: (template: DocumentTemplate) => void;
  onInsertText: (text: string, asHtml?: boolean) => void;
  onOpenPoetryModal: () => void;
  onOpenFancyFontsModal: () => void;
  onOpenBorderModal: () => void;
  onOpenPageSizeModal: () => void;
  onOpenPageColorModal: () => void;
  pageColor: string;
  setPageColor: (color: string) => void;
  hasBorder: boolean;
  setHasBorder: (val: boolean) => void;
  borderType: string;
  setBorderType: (type: 'solid' | 'double' | 'dashed' | 'dotted' | 'corners' | 'royal') => void;
  borderColorTone: string;
  setBorderColorTone: (tone: 'dark' | 'light' | 'gold' | 'blue' | 'green' | 'red') => void;
  isUrduKeyboardOpen: boolean;
  setIsUrduKeyboardOpen: (val: boolean) => void;
  onTriggerImageUpload: () => void;
  wordCount: number;
  charCount: number;
  pagesCount: number;
  pageSize: string;
  onUndo: () => void;
  onRedo: () => void;
}

// Popular Islamic & Literary Emblems and Calligraphy Symbols
const ISLAMIC_SYMBOLS = [
  { symbol: 'ﷺ', name: 'صلی اللہ علیہ وسلم', tag: 'Durood' },
  { symbol: 'ﷻ', name: 'جل جلالہ', tag: 'Jalla Jalaluh' },
  { symbol: '﷽', name: 'بسم اللہ الرحمن الرحیم', tag: 'Bismillah' },
  { symbol: 'ؓ', name: 'رضی اللہ عنہ', tag: 'Razi Allah' },
  { symbol: 'ؒ', name: 'رحمۃ اللہ علیہ', tag: 'Rehmat Allah' },
  { symbol: 'ؑ', name: 'علیہ السلام', tag: 'Alayhi Salam' },
  { symbol: '۝', name: 'آیت کا نشان (End of Ayah)', tag: 'Quran' },
  { symbol: '۞', name: 'حزب / رکوع نشان', tag: 'Quran' },
  { symbol: '؀', name: 'نمبر / سنہ نشان', tag: 'Urdu Num' },
  { symbol: '؁', name: 'صفحہ نمبر نشان', tag: 'Page Num' },
  { symbol: '؂', name: 'شعر علامت', tag: 'Poetry' },
  { symbol: '؏', name: 'مصرعہ علامت', tag: 'Poetry Line' },
  { symbol: '﴾', name: 'قرآنی بریکٹ دائیں', tag: 'Bracket' },
  { symbol: '﴿', name: 'قرآنی بریکٹ بائیں', tag: 'Bracket' }
];

// Decorative Dividers & Borders for Urdu Documents
const DECORATIVE_DIVIDERS = [
  '✦ ━━━━━━━━━━━━ ✦',
  '❖ ──────────────── ❖',
  '❧ ════════════════ ❧',
  '❁ ──────── ❁ ──────── ❁',
  '— ❀ — ❀ — ❀ —',
  '◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆',
  '═════════════════════════',
  '─────────────────────────'
];

// Brackets & Punctuations
const CALLIGRAPHIC_BRACKETS = [
  { left: '« ', right: ' »', name: 'فرانسیسی اردو واوین « »' },
  { left: '《 ', right: ' 》', name: 'خطاطی بریکٹ 《 》' },
  { left: '【 ', right: ' 】', name: 'بولڈ ٹائٹل بریکٹ 【 】' },
  { left: '“', right: '”', name: 'انگلش کوٹیشن “ ”' },
  { left: '‘', right: '’', name: 'سنگل کوٹیشن ‘ ’' },
  { left: '〔 ', right: ' 〕', name: 'ٹارٹوز بریکٹ 〔 〕' },
  { left: '— ', right: ' —', name: 'ایم ڈیش (تفصیل)' }
];

export const CanvaSidebar: React.FC<CanvaSidebarProps> = ({
  activeTab,
  setActiveTab,
  onApplyTemplate,
  onInsertText,
  onOpenPoetryModal,
  onOpenFancyFontsModal,
  onOpenBorderModal,
  onOpenPageSizeModal,
  onOpenPageColorModal,
  pageColor,
  setPageColor,
  hasBorder,
  setHasBorder,
  borderType,
  setBorderType,
  borderColorTone,
  setBorderColorTone,
  isUrduKeyboardOpen,
  setIsUrduKeyboardOpen,
  onTriggerImageUpload,
  wordCount,
  charCount,
  pagesCount,
  pageSize,
  onUndo,
  onRedo
}) => {
  const [templateSearch, setTemplateSearch] = useState('');
  const [elementSearch, setElementSearch] = useState('');
  const [elementCategory, setElementCategory] = useState<ElementCategory>('all');
  const [elementColor, setElementColor] = useState<string>('#7c3aed');
  const [elementStyleMode, setElementStyleMode] = useState<ShapeStyleMode>('fill');
  const [recentlyInsertedId, setRecentlyInsertedId] = useState<string | null>(null);

  // Filter templates by search
  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.defaultTitle.toLowerCase().includes(templateSearch.toLowerCase())
  );

  // Filter elements by category and search query
  const filteredElements = ALL_ELEMENTS.filter((item) => {
    const matchesCat = elementCategory === 'all' || item.category === elementCategory;
    if (!matchesCat) return false;

    if (!elementSearch.trim()) return true;
    const q = elementSearch.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.urduName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const handleInsertElement = (item: ElementItem) => {
    const html = item.getHtml(elementColor, elementStyleMode);
    onInsertText(html, true);
    setRecentlyInsertedId(item.id);
    setTimeout(() => {
      setRecentlyInsertedId(null);
    }, 1200);
  };

  const handleTabClick = (tabKey: CanvaSidebarTab) => {
    if (activeTab === tabKey) {
      setActiveTab(null); // toggle off if already open
    } else {
      setActiveTab(tabKey);
    }
  };

  return (
    <aside className="relative flex shrink-0 z-30 select-none no-print h-full">
      {/* ---------------------------------------------------- */}
      {/* 1. VERTICAL LEFT ICON BAR (Canva Brand Dark/Light)   */}
      {/* ---------------------------------------------------- */}
      <div
        id="canva-sidebar-icon-dock"
        className="w-18 bg-white border-r border-gray-200 flex flex-col items-center py-2 h-full z-40 overflow-y-auto shrink-0 shadow-2xs"
      >
        {/* Templates Tab */}
        <button
          id="canva-tab-templates"
          type="button"
          onClick={() => handleTabClick('templates')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'templates'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Design Templates (ڈیزائن ٹیمپلیٹس)"
        >
          <LayoutTemplate className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Templates</span>
        </button>

        {/* Elements Tab */}
        <button
          id="canva-tab-elements"
          type="button"
          onClick={() => handleTabClick('elements')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'elements'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Elements & Islamic Symbols (عناصر و علامات)"
        >
          <Shapes className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Elements</span>
        </button>

        {/* Text Tab */}
        <button
          id="canva-tab-text"
          type="button"
          onClick={() => handleTabClick('text')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'text'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Text & Headings (متن و خطاطی)"
        >
          <Type className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Text</span>
        </button>

        {/* Poetry Studio Tab (Brand / Poetry with gold crown like Canva screenshot) */}
        <button
          id="canva-tab-poetry"
          type="button"
          onClick={() => handleTabClick('poetry')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'poetry'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Poetry Studio (شاعری اسٹوڈیو)"
        >
          <span className="text-[10px] absolute top-1.5 right-2.5 select-none" title="Special Feature">👑</span>
          <Feather className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Poetry</span>
        </button>

        {/* Uploads Tab */}
        <button
          id="canva-tab-uploads"
          type="button"
          onClick={() => handleTabClick('uploads')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'uploads'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Uploads & Images (تصاویر)"
        >
          <UploadCloud className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Uploads</span>
        </button>

        {/* Tools Tab */}
        <button
          id="canva-tab-tools"
          type="button"
          onClick={() => handleTabClick('tools')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'tools'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Tools & Keyboard (اوزار و کی بورڈ)"
        >
          <Wrench className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Tools</span>
        </button>

        {/* Page / Projects Tab */}
        <button
          id="canva-tab-page"
          type="button"
          onClick={() => handleTabClick('page')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'page'
              ? 'bg-cyan-50 text-[#00838f] font-semibold border-l-4 border-[#00838f]'
              : 'text-gray-600 hover:text-[#00838f] hover:bg-gray-50'
          }`}
          title="Page & Frame Design (صفحہ و فریم)"
        >
          <Palette className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">Page</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. EXPANDABLE FLYOUT DRAWER (Slides open to RIGHT)   */}
      {/* ---------------------------------------------------- */}
      {activeTab && (
        <div
          id="canva-sidebar-drawer"
          className="w-80 sm:w-[350px] bg-white border-r border-gray-200 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-200 z-30"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/90 shrink-0">
            <div className="flex items-center gap-2">
              {activeTab === 'templates' && <LayoutTemplate className="w-4 h-4 text-cyan-600" />}
              {activeTab === 'elements' && <Shapes className="w-4 h-4 text-purple-600" />}
              {activeTab === 'text' && <Type className="w-4 h-4 text-blue-600" />}
              {activeTab === 'poetry' && <Feather className="w-4 h-4 text-rose-600" />}
              {activeTab === 'uploads' && <UploadCloud className="w-4 h-4 text-indigo-600" />}
              {activeTab === 'tools' && <Wrench className="w-4 h-4 text-amber-600" />}
              {activeTab === 'page' && <Palette className="w-4 h-4 text-emerald-600" />}
              <span className="font-bold text-gray-900 text-sm">
                {activeTab === 'templates' && 'Templates (ٹیمپلیٹس)'}
                {activeTab === 'elements' && 'Elements & Symbols (عناصر)'}
                {activeTab === 'text' && 'Text & Headings (متن)'}
                {activeTab === 'poetry' && 'Poetry Studio (شاعری)'}
                {activeTab === 'uploads' && 'Uploads & Images (تصاویر)'}
                {activeTab === 'tools' && 'Tools & Keyboard (اوزار)'}
                {activeTab === 'page' && 'Page & Frame (ورق و فریم)'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ============================================== */}
            {/* TAB: TEMPLATES                                 */}
            {/* ============================================== */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search templates / ٹیمپلیٹ تلاش کریں..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>

                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Ready-to-use Documents
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {filteredTemplates.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onApplyTemplate(t)}
                      className="group p-3 rounded-xl border border-gray-200 hover:border-cyan-500 hover:shadow-md transition cursor-pointer bg-white flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs text-gray-900 group-hover:text-cyan-700 transition">
                          {t.name}
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 shrink-0">
                          {t.hasBorder ? 'Framed' : 'Clean'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 font-nastaliq" dir="rtl">
                        {t.defaultTitle}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 group-hover:text-cyan-700 font-medium">
                        <span>Click to Apply</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: ELEMENTS & SYMBOLS (With Search & Colors) */}
            {/* ============================================== */}
            {activeTab === 'elements' && (
              <div className="space-y-3.5">
                {/* 1. Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    id="canva-elements-search-input"
                    type="text"
                    value={elementSearch}
                    onChange={(e) => setElementSearch(e.target.value)}
                    placeholder="Search shapes, English icons, badges... / تلاش کریں"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  {elementSearch && (
                    <button
                      type="button"
                      onClick={() => setElementSearch('')}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 2. Color & Style Controls (Live Customization) */}
                <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      <span>Element Color (رنگ منتخب کریں)</span>
                    </div>
                    {/* Hex Badge and Native Picker */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-purple-200 text-purple-800 uppercase shadow-2xs">
                        {elementColor}
                      </span>
                      <label
                        className="relative w-6 h-6 rounded-lg cursor-pointer border border-gray-300 shadow-2xs flex items-center justify-center overflow-hidden hover:scale-110 transition"
                        style={{ backgroundColor: elementColor }}
                        title="Choose custom color (اپنی مرضی کا رنگ)"
                      >
                        <input
                          type="color"
                          value={elementColor}
                          onChange={(e) => setElementColor(e.target.value)}
                          className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Swatches Grid */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {POPULAR_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setElementColor(col.hex)}
                        className={`w-5 h-5 rounded-full border transition cursor-pointer flex items-center justify-center ${
                          elementColor.toLowerCase() === col.hex.toLowerCase()
                            ? 'ring-2 ring-purple-600 ring-offset-1 scale-110 shadow-xs'
                            : 'border-black/10 hover:scale-110'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {elementColor.toLowerCase() === col.hex.toLowerCase() && (
                          <Check className={`w-3 h-3 ${col.hex === '#ffffff' ? 'text-gray-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Style Mode Selector (Fill / Outline / Soft Tint) */}
                  <div className="pt-2 border-t border-purple-100/80 flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 font-medium">انداز (Style):</span>
                    <div className="inline-flex bg-white rounded-lg p-0.5 border border-purple-200 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('fill')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'fill'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'text-gray-600 hover:text-purple-700'
                        }`}
                      >
                        Fill (ٹھوس)
                      </button>
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('outline')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'outline'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'text-gray-600 hover:text-purple-700'
                        }`}
                      >
                        Outline (خاکہ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('tint')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'tint'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'text-gray-600 hover:text-purple-700'
                        }`}
                      >
                        Tint (ہلکا)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Category Filter Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {(
                    [
                      { id: 'all', label: 'All (سب)', count: ALL_ELEMENTS.length },
                      { id: 'shapes', label: 'Shapes (اشکال)', count: ALL_ELEMENTS.filter((e) => e.category === 'shapes').length },
                      { id: 'lines', label: 'Lines (خطوط)', count: ALL_ELEMENTS.filter((e) => e.category === 'lines').length },
                      { id: 'english', label: 'English (انگلش)', count: ALL_ELEMENTS.filter((e) => e.category === 'english').length },
                      { id: 'islamic', label: 'Islamic (اسلامی)', count: ALL_ELEMENTS.filter((e) => e.category === 'islamic').length },
                      { id: 'dividers', label: 'Dividers', count: ALL_ELEMENTS.filter((e) => e.category === 'dividers').length },
                      { id: 'brackets', label: 'Brackets', count: ALL_ELEMENTS.filter((e) => e.category === 'brackets').length }
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setElementCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition cursor-pointer flex items-center gap-1 ${
                        elementCategory === cat.id
                          ? 'bg-purple-700 text-white shadow-2xs font-semibold'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* 4. Results Header */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 px-0.5">
                  <span>
                    کل عناصر: <strong className="text-gray-800">{filteredElements.length}</strong>
                  </span>
                  <span className="text-[10px] text-purple-700 font-medium">کلک کر کے شامل کریں</span>
                </div>

                {/* 5. Elements Grid */}
                {filteredElements.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 space-y-2">
                    <p className="text-xs text-gray-500">کوئی عنصر تلاش کے مطابق نہیں ملا۔</p>
                    <button
                      type="button"
                      onClick={() => {
                        setElementSearch('');
                        setElementCategory('all');
                      }}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      تلاش ختم کریں (Clear Search)
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-0.5">
                    {filteredElements.map((item) => {
                      const isRecentlyAdded = recentlyInsertedId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleInsertElement(item)}
                          className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition cursor-pointer active:scale-95 group ${
                            isRecentlyAdded
                              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400'
                              : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-xs'
                          }`}
                          title={`${item.name} (${item.urduName})`}
                        >
                          {/* Recently added feedback badge */}
                          {isRecentlyAdded && (
                            <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs z-10 animate-in zoom-in-50">
                              <Check className="w-2.5 h-2.5" /> شامل ہو گیا
                            </span>
                          )}

                          {/* Preview container */}
                          <div className="w-full h-12 flex items-center justify-center group-hover:scale-105 transition duration-150 overflow-hidden">
                            {item.renderPreview(elementColor, elementStyleMode)}
                          </div>

                          {/* Titles */}
                          <div className="w-full mt-1.5 pt-1.5 border-t border-gray-100 text-center">
                            <div className="text-[11px] font-bold text-gray-800 truncate leading-tight group-hover:text-purple-700 transition">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-nastaliq truncate leading-tight mt-0.5">
                              {item.urduName}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: TEXT & HEADINGS                           */}
            {/* ============================================== */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Headings / اہم سرخیاں
                </div>

                {/* H1 Heading */}
                <button
                  type="button"
                  onClick={() => onInsertText('<h1 style="font-size: 28px; font-weight: bold; margin: 16px 0 8px; line-height: 1.8;">بڑی سرخی (Main Title)</h1>', true)}
                  className="w-full p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-xl text-right transition cursor-pointer group"
                >
                  <div className="font-bold text-lg text-gray-900 group-hover:text-blue-700 font-nastaliq">
                    بڑی سرخی شامل کریں
                  </div>
                  <div className="text-[11px] text-gray-400">Heading 1 • 28px Bold</div>
                </button>

                {/* H2 Subheading */}
                <button
                  type="button"
                  onClick={() => onInsertText('<h2 style="font-size: 22px; font-weight: bold; margin: 12px 0 6px; line-height: 1.8;">ذیلی سرخی (Subheading)</h2>', true)}
                  className="w-full p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-xl text-right transition cursor-pointer group"
                >
                  <div className="font-semibold text-base text-gray-800 group-hover:text-blue-700 font-nastaliq">
                    درمیانی سرخی شامل کریں
                  </div>
                  <div className="text-[11px] text-gray-400">Heading 2 • 22px Semi-bold</div>
                </button>

                {/* Body Paragraph */}
                <button
                  type="button"
                  onClick={() => onInsertText('<p style="font-size: 16px; margin: 8px 0; line-height: 2.2;">یہاں اپنا تفصیلی پیراگراف تحریر فرمائیں...</p>', true)}
                  className="w-full p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-xl text-right transition cursor-pointer group"
                >
                  <div className="text-sm text-gray-700 group-hover:text-blue-700 font-nastaliq">
                    عام پیراگراف کا متن
                  </div>
                  <div className="text-[11px] text-gray-400">Body Text • 16px Regular</div>
                </button>

                {/* Fancy Text Launcher */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onOpenFancyFontsModal}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>اسٹائلش فونٹس و کشیدہ خطاطی پینل</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: POETRY STUDIO (شاعری اسٹوڈیو)              */}
            {/* ============================================== */}
            {activeTab === 'poetry' && (
              <div className="space-y-4">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-rose-600" />
                    <span>اردو و فارسی شاعری اسٹوڈیو 👑</span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-nastaliq">
                    شعر و شاعری کو دو کالم، خطاطی کالم اور متوازن مصرعوں کے انداز میں درج کریں۔
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenPoetryModal}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Feather className="w-4 h-4" />
                  <span>اوپن شاعری لائبریری و اسٹوڈیو</span>
                </button>

                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pt-2">
                  فوری کلاسک اشعار کے نمونے:
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => onInsertText('<div style="text-align: center; margin: 16px 0; font-family: inherit; font-size: 18px; line-height: 2.2;"><p>ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے</p><p>بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے</p><span style="font-size: 12px; color: #9ca3af;">— مرزا غالب</span></div>', true)}
                    className="p-3 bg-gray-50 hover:bg-rose-50 hover:border-rose-300 border border-gray-200 rounded-xl cursor-pointer text-center font-nastaliq text-xs text-gray-800 transition"
                  >
                    <p className="font-semibold text-sm">ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے</p>
                    <p className="text-[10px] text-gray-400 mt-1">مرزا اسد اللہ خان غالب</p>
                  </div>

                  <div
                    onClick={() => onInsertText('<div style="text-align: center; margin: 16px 0; font-family: inherit; font-size: 18px; line-height: 2.2;"><p>ستاروں سے آگے جہاں اور بھی ہیں</p><p>ابھی عشق کے امتحاں اور بھی ہیں</p><span style="font-size: 12px; color: #9ca3af;">— علامہ اقبال</span></div>', true)}
                    className="p-3 bg-gray-50 hover:bg-rose-50 hover:border-rose-300 border border-gray-200 rounded-xl cursor-pointer text-center font-nastaliq text-xs text-gray-800 transition"
                  >
                    <p className="font-semibold text-sm">ستاروں سے آگے جہاں اور بھی ہیں</p>
                    <p className="text-[10px] text-gray-400 mt-1">علامہ محمد اقبال</p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: UPLOADS & IMAGES                          */}
            {/* ============================================== */}
            {activeTab === 'uploads' && (
              <div className="space-y-4">
                <div
                  onClick={onTriggerImageUpload}
                  className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-98 group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-indigo-950">
                    تصویر منتخب کریں یا یہاں ڈراپ کریں
                  </div>
                  <div className="text-[10px] text-indigo-700/80 mt-1">
                    Upload Images (PNG, JPG, SVG, WebP)
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2 text-gray-600">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>تصویر شامل کرنے کے بعد:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    تصویر پر کلک کر کے آپ کینوا کی طرح اس کے کونوں اور کناروں سے باآسانی اس کا سائز چھوٹا یا بڑا کر سکتے ہیں اور گولائی یا سایہ شامل کر سکتے ہیں۔
                  </p>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: TOOLS & UTILITIES                         */}
            {/* ============================================== */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                {/* Urdu Keyboard Toggle */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-gray-800">اردو فونیٹک کی بورڈ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUrduKeyboardOpen(!isUrduKeyboardOpen)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        isUrduKeyboardOpen ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isUrduKeyboardOpen ? 'فعال ہے (On)' : 'بند ہے (Off)'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    اسکرین پر ورچوئل کی بورڈ دکھائیں تاکہ بغیر اردو کی بورڈ کے آسانی سے ٹائپ کر سکیں۔
                  </p>
                </div>

                {/* Undo / Redo */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onUndo}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <Undo className="w-3.5 h-3.5" />
                    <span>Undo (Ctrl+Z)</span>
                  </button>
                  <button
                    type="button"
                    onClick={onRedo}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <Redo className="w-3.5 h-3.5" />
                    <span>Redo (Ctrl+Y)</span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-gray-900">دستاویز کے اعداد و شمار:</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-blue-600">{wordCount}</div>
                      <div className="text-[10px] text-gray-400">الفاظ (Words)</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-purple-600">{charCount}</div>
                      <div className="text-[10px] text-gray-400">حروف (Chars)</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-emerald-600">{pagesCount}</div>
                      <div className="text-[10px] text-gray-400">صفحات (Pages)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: PAGE & FRAME SETTINGS                     */}
            {/* ============================================== */}
            {activeTab === 'page' && (
              <div className="space-y-4">
                {/* Page Color Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">ورق کا رنگ (Page Background)</span>
                    <button
                      type="button"
                      onClick={onOpenPageColorModal}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      مزید رنگ
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {PAGE_COLORS.slice(0, 10).map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setPageColor(hex)}
                        style={{ backgroundColor: hex }}
                        className={`h-8 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          pageColor.toLowerCase() === hex.toLowerCase()
                            ? 'ring-2 ring-blue-600 ring-offset-2 border-transparent scale-105'
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        title={hex}
                      >
                        {pageColor.toLowerCase() === hex.toLowerCase() && (
                          <Check className={`w-3.5 h-3.5 ${isColorDark(hex) ? 'text-white' : 'text-gray-900'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame / Border Toggle */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">صفحہ کا فریم (Border / Frame)</span>
                    <button
                      type="button"
                      onClick={() => setHasBorder(!hasBorder)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        hasBorder ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {hasBorder ? 'آن ہے (On)' : 'آف ہے (Off)'}
                    </button>
                  </div>

                  {hasBorder && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-gray-500">فریم اسٹائل منتخب کریں:</div>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {(['solid', 'double', 'dashed', 'dotted', 'corners', 'royal'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBorderType(b)}
                            className={`py-1.5 px-2 rounded-lg border capitalize transition text-center ${
                              borderType === b
                                ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={onOpenBorderModal}
                        className="w-full mt-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>تفصیلی فریم ترتیبات (Border Modal)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sheet Size */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">ورق کا سائز (Sheet Size)</div>
                    <div className="text-[11px] text-gray-500 font-mono">{pageSize}</div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPageSizeModal}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition"
                  >
                    تبدیل کریں
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
