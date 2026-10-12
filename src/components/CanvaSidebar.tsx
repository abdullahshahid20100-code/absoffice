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
  Minus,
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
  CheckCircle2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy
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
  selectedImage?: HTMLImageElement | null;
  imageWidthPercent?: number;
  imageAlignment?: 'left' | 'center' | 'right' | 'float-left' | 'float-right';
  imageRounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  imageShadow?: boolean;
  imageBorder?: boolean;
  onUpdateImageWidth?: (pct: number) => void;
  onUpdateImageAlignment?: (align: 'left' | 'center' | 'right' | 'float-left' | 'float-right') => void;
  onUpdateImageRounded?: (rounded: 'none' | 'sm' | 'md' | 'lg' | 'full') => void;
  onToggleImageShadow?: () => void;
  onToggleImageBorder?: () => void;
  onDeleteSelectedImage?: () => void;
  onDuplicateSelectedImage?: () => void;
  onDeselectImage?: () => void;
  lang?: 'urdu' | 'english';
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
  onRedo,
  selectedImage,
  imageWidthPercent = 50,
  imageAlignment = 'left',
  imageRounded = 'md',
  imageShadow = true,
  imageBorder = false,
  onUpdateImageWidth,
  onUpdateImageAlignment,
  onUpdateImageRounded,
  onToggleImageShadow,
  onToggleImageBorder,
  onDeleteSelectedImage,
  onDuplicateSelectedImage,
  onDeselectImage,
  lang = 'urdu'
}) => {
  const isUrdu = lang === 'urdu';
  const [templateSearch, setTemplateSearch] = useState('');
  const [elementSearch, setElementSearch] = useState('');
  const [elementCategory, setElementCategory] = useState<ElementCategory>('all');
  const [elementColor, setElementColor] = useState<string>('#3b5bfd');
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
      {/* 1. VERTICAL LEFT ICON BAR (Theme Styled)             */}
      {/* ---------------------------------------------------- */}
      <div
        id="canva-sidebar-icon-dock"
        className="w-18 bg-white border-r border-slate-200 flex flex-col items-center py-2 h-full z-40 overflow-y-auto shrink-0 shadow-2xs"
      >
        {/* Templates Tab */}
        <button
          id="canva-tab-templates"
          type="button"
          onClick={() => handleTabClick('templates')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'templates'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'ڈیزائن ٹیمپلیٹس' : 'Design Templates'}
        >
          <LayoutTemplate className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'ٹیمپلیٹس' : 'Templates'}
          </span>
        </button>

        {/* Elements Tab */}
        <button
          id="canva-tab-elements"
          type="button"
          onClick={() => handleTabClick('elements')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'elements'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'عناصر اور اشکال' : 'Elements & Shapes'}
        >
          <Shapes className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'عناصر' : 'Elements'}
          </span>
        </button>

        {/* Text Tab */}
        <button
          id="canva-tab-text"
          type="button"
          onClick={() => handleTabClick('text')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'text'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'متن اور سرخیاں' : 'Text & Headings'}
        >
          <Type className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'تحریر' : 'Text'}
          </span>
        </button>

        {/* Poetry Studio Tab */}
        <button
          id="canva-tab-poetry"
          type="button"
          onClick={() => handleTabClick('poetry')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'poetry'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'شاعری اسٹوڈیو' : 'Poetry Studio'}
        >
          <span className="text-[10px] absolute top-1.5 right-2.5 select-none" title="Special Feature">👑</span>
          <Feather className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'شاعری' : 'Poetry'}
          </span>
        </button>

        {/* Uploads Tab */}
        <button
          id="canva-tab-uploads"
          type="button"
          onClick={() => handleTabClick('uploads')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'uploads'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'تصاویر اور اپلوڈ' : 'Uploads & Images'}
        >
          <UploadCloud className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'تصاویر' : 'Uploads'}
          </span>
        </button>

        {/* Tools Tab */}
        <button
          id="canva-tab-tools"
          type="button"
          onClick={() => handleTabClick('tools')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'tools'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'اوزار اور کی بورڈ' : 'Tools & Utilities'}
        >
          <Wrench className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'اوزار' : 'Tools'}
          </span>
        </button>

        {/* Page / Projects Tab */}
        <button
          id="canva-tab-page"
          type="button"
          onClick={() => handleTabClick('page')}
          className={`w-full py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer relative group ${
            activeTab === 'page'
              ? 'bg-indigo-50 text-[#3b5bfd] font-semibold border-l-4 border-[#3b5bfd]'
              : 'text-gray-600 hover:text-[#3b5bfd] hover:bg-indigo-50/50'
          }`}
          title={isUrdu ? 'صفحہ اور فریم ڈیزائن' : 'Page & Frame Design'}
        >
          <Palette className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[11px] tracking-tight leading-tight">
            {isUrdu ? 'صفحہ' : 'Page'}
          </span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. EXPANDABLE FLYOUT DRAWER (Slides open to RIGHT)   */}
      {/* ---------------------------------------------------- */}
      {activeTab && (
        <div
          id="canva-sidebar-drawer"
          className="w-80 sm:w-[350px] bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-200 z-30"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center gap-2">
              {activeTab === 'templates' && <LayoutTemplate className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'elements' && <Shapes className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'text' && <Type className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'poetry' && <Feather className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'uploads' && <UploadCloud className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'tools' && <Wrench className="w-4 h-4 text-[#3b5bfd]" />}
              {activeTab === 'page' && <Palette className="w-4 h-4 text-[#3b5bfd]" />}
              <span className="font-bold text-gray-900 text-sm">
                {activeTab === 'templates' && (isUrdu ? 'ڈیزائن ٹیمپلیٹس' : 'Design Templates')}
                {activeTab === 'elements' && (isUrdu ? 'عناصر اور اشکال' : 'Elements & Shapes')}
                {activeTab === 'text' && (isUrdu ? 'متن اور سرخیاں' : 'Text & Headings')}
                {activeTab === 'poetry' && (isUrdu ? 'شاعری اسٹوڈیو' : 'Poetry Studio')}
                {activeTab === 'uploads' && (isUrdu ? 'تصاویر اور اپلوڈ' : 'Uploads & Images')}
                {activeTab === 'tools' && (isUrdu ? 'اوزار اور ترتیبات' : 'Tools & Utilities')}
                {activeTab === 'page' && (isUrdu ? 'ورق اور فریم ڈیزائن' : 'Page & Frame Design')}
              </span>
            </div>
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
              title={isUrdu ? 'بند کریں' : 'Close Drawer'}
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
                    placeholder={isUrdu ? 'ٹیمپلیٹ تلاش کریں...' : 'Search templates...'}
                    className="w-full bg-[#f4f4f4]/60 border border-[#018790]/20 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b7b5]/40 transition"
                  />
                </div>

                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {isUrdu ? 'تیار شدہ دستاویزات' : 'Ready-to-use Documents'}
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {filteredTemplates.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onApplyTemplate(t)}
                      className="group p-3 rounded-xl border border-[#018790]/20 hover:border-[#018790] hover:shadow-md transition cursor-pointer bg-white flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs text-gray-900 group-hover:text-[#005461] transition">
                          {t.name}
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00b7b5]/15 text-[#005461] border border-[#018790]/20 shrink-0">
                          {t.hasBorder ? (isUrdu ? 'فریم شدہ' : 'Framed') : (isUrdu ? 'سادہ' : 'Clean')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 font-nastaliq" dir={isUrdu ? 'rtl' : 'ltr'}>
                        {t.defaultTitle}
                      </p>
                      <div className="mt-2 pt-2 border-t border-[#018790]/15 flex items-center justify-between text-[11px] text-gray-400 group-hover:text-[#005461] font-medium">
                        <span>{isUrdu ? 'لاگو کرنے کے لیے کلک کریں' : 'Click to Apply'}</span>
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
                    placeholder={isUrdu ? 'عناصر، لکیریں، اشکال، علامات تلاش کریں...' : 'Search shapes, lines, icons, symbols...'}
                    className="w-full bg-[#f4f4f4]/60 border border-[#018790]/20 rounded-xl pl-9 pr-8 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b7b5]/40 transition"
                  />
                  {elementSearch && (
                    <button
                      type="button"
                      onClick={() => setElementSearch('')}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 transition"
                      title={isUrdu ? 'تلاش ختم کریں' : 'Clear search'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 2. Color & Style Controls (Live Customization) */}
                <div className="bg-[#00b7b5]/10 border border-[#018790]/20 rounded-2xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#005461]">
                      <Palette className="w-3.5 h-3.5 text-[#018790]" />
                      <span>{isUrdu ? 'عنصر کا رنگ' : 'Element Color'}</span>
                    </div>
                    {/* Hex Badge and Native Picker */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#018790]/20 text-[#005461] uppercase shadow-2xs">
                        {elementColor}
                      </span>
                      <label
                        className="relative w-6 h-6 rounded-lg cursor-pointer border border-[#018790]/25 shadow-2xs flex items-center justify-center overflow-hidden hover:scale-110 transition"
                        style={{ backgroundColor: elementColor }}
                        title={isUrdu ? 'اپنی مرضی کا رنگ منتخب کریں' : 'Choose custom color'}
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
                            ? 'ring-2 ring-[#005461] ring-offset-1 scale-110 shadow-xs'
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
                  <div className="pt-2 border-t border-[#018790]/20 flex items-center justify-between text-[11px]">
                    <span className="text-gray-700 font-medium">{isUrdu ? 'انداز:' : 'Style:'}</span>
                    <div className="inline-flex bg-white rounded-lg p-0.5 border border-[#018790]/20 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('fill')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'fill'
                            ? 'bg-[#005461] text-white shadow-2xs font-bold'
                            : 'text-gray-600 hover:text-[#005461]'
                        }`}
                      >
                        {isUrdu ? 'ٹھوس' : 'Solid'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('outline')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'outline'
                            ? 'bg-[#005461] text-white shadow-2xs font-bold'
                            : 'text-gray-600 hover:text-[#005461]'
                        }`}
                      >
                        {isUrdu ? 'خاکہ' : 'Outline'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setElementStyleMode('tint')}
                        className={`px-2 py-0.5 rounded transition ${
                          elementStyleMode === 'tint'
                            ? 'bg-[#005461] text-white shadow-2xs font-bold'
                            : 'text-gray-600 hover:text-[#005461]'
                        }`}
                      >
                        {isUrdu ? 'ہلکا' : 'Soft Tint'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Category Filter Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {(
                    [
                      { id: 'all', label: isUrdu ? 'تمام' : 'All', count: ALL_ELEMENTS.length },
                      { id: 'shapes', label: isUrdu ? 'اشکال' : 'Shapes', count: ALL_ELEMENTS.filter((e) => e.category === 'shapes').length },
                      { id: 'lines', label: isUrdu ? 'خطوط' : 'Lines', count: ALL_ELEMENTS.filter((e) => e.category === 'lines').length },
                      { id: 'english', label: isUrdu ? 'انگریزی' : 'English', count: ALL_ELEMENTS.filter((e) => e.category === 'english').length },
                      { id: 'islamic', label: isUrdu ? 'اسلامی' : 'Islamic', count: ALL_ELEMENTS.filter((e) => e.category === 'islamic').length },
                      { id: 'dividers', label: isUrdu ? 'لکیریں' : 'Dividers', count: ALL_ELEMENTS.filter((e) => e.category === 'dividers').length },
                      { id: 'brackets', label: isUrdu ? 'بریکٹس' : 'Brackets', count: ALL_ELEMENTS.filter((e) => e.category === 'brackets').length }
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setElementCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition cursor-pointer flex items-center gap-1 ${
                        elementCategory === cat.id
                          ? 'bg-[#005461] text-white shadow-2xs font-semibold'
                          : 'bg-[#f4f4f4] text-gray-700 hover:bg-[#00b7b5]/15 border border-[#018790]/20'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* 4. Results Header */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 px-0.5">
                  <span>
                    {isUrdu ? (
                      <>کل عناصر: <strong className="text-gray-800">{filteredElements.length}</strong></>
                    ) : (
                      <>Total items: <strong className="text-gray-800">{filteredElements.length}</strong></>
                    )}
                  </span>
                  <span className="text-[10px] text-[#005461] font-medium">
                    {isUrdu ? 'کلک کر کے شامل کریں' : 'Click to insert'}
                  </span>
                </div>

                {/* 5. Elements Grid */}
                {filteredElements.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-[#018790]/25 rounded-2xl bg-[#f4f4f4]/50 space-y-2">
                    <p className="text-xs text-gray-500">
                      {isUrdu ? 'کوئی عنصر تلاش کے مطابق نہیں ملا۔' : 'No elements found matching your search.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setElementSearch('');
                        setElementCategory('all');
                      }}
                      className="px-3 py-1.5 bg-[#00b7b5]/15 text-[#005461] hover:bg-[#00b7b5]/25 rounded-lg text-xs font-bold transition cursor-pointer border border-[#018790]/30"
                    >
                      {isUrdu ? 'فلٹر ختم کریں' : 'Clear Filters'}
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
                              : 'bg-white border-[#018790]/20 hover:border-[#018790] hover:bg-[#00b7b5]/10 hover:shadow-xs'
                          }`}
                          title={isUrdu ? `${item.urduName} (${item.name})` : item.name}
                        >
                          {/* Recently added feedback badge */}
                          {isRecentlyAdded && (
                            <span className="absolute top-1 right-1 bg-[#005461] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs z-10 animate-in zoom-in-50">
                              <Check className="w-2.5 h-2.5" /> {isUrdu ? 'شامل ہو گیا' : 'Added'}
                            </span>
                          )}

                          {/* Preview container */}
                          <div className="w-full h-12 flex items-center justify-center group-hover:scale-105 transition duration-150 overflow-hidden">
                            {item.renderPreview(elementColor, elementStyleMode)}
                          </div>

                          {/* Titles */}
                          <div className="w-full mt-1.5 pt-1.5 border-t border-[#018790]/15 text-center">
                            <div className="text-[11px] font-bold text-gray-800 truncate leading-tight group-hover:text-[#005461] transition">
                              {isUrdu ? item.urduName : item.name}
                            </div>
                            {isUrdu && (
                              <div className="text-[10px] text-gray-500 font-sans truncate leading-tight mt-0.5">
                                {item.name}
                              </div>
                            )}
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
                  {isUrdu ? 'اہم سرخیاں اور متن' : 'Quick Headings & Text'}
                </div>

                {/* H1 Heading */}
                <button
                  type="button"
                  onClick={() => onInsertText(
                    isUrdu 
                      ? '<h1 style="font-size: 28px; font-weight: bold; margin: 16px 0 8px; line-height: 1.8;">بڑی سرخی</h1>'
                      : '<h1 style="font-size: 28px; font-weight: bold; margin: 16px 0 8px; line-height: 1.4;">Add a Main Heading</h1>',
                    true
                  )}
                  className={`w-full p-3 bg-white hover:bg-[#00b7b5]/10 hover:border-[#018790] border border-[#018790]/20 rounded-xl transition cursor-pointer group ${isUrdu ? 'text-right' : 'text-left'}`}
                >
                  <div className={`font-bold text-lg text-gray-900 group-hover:text-[#005461] ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                    {isUrdu ? 'بڑی سرخی شامل کریں' : 'Add Heading'}
                  </div>
                  <div className="text-[11px] text-gray-400">Heading 1 • 28px Bold</div>
                </button>

                {/* H2 Subheading */}
                <button
                  type="button"
                  onClick={() => onInsertText(
                    isUrdu
                      ? '<h2 style="font-size: 22px; font-weight: bold; margin: 12px 0 6px; line-height: 1.8;">ذیلی سرخی</h2>'
                      : '<h2 style="font-size: 22px; font-weight: bold; margin: 12px 0 6px; line-height: 1.4;">Add a Subheading</h2>',
                    true
                  )}
                  className={`w-full p-3 bg-white hover:bg-[#00b7b5]/10 hover:border-[#018790] border border-[#018790]/20 rounded-xl transition cursor-pointer group ${isUrdu ? 'text-right' : 'text-left'}`}
                >
                  <div className={`font-semibold text-base text-gray-800 group-hover:text-[#005461] ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                    {isUrdu ? 'درمیانی سرخی شامل کریں' : 'Add Subheading'}
                  </div>
                  <div className="text-[11px] text-gray-400">Heading 2 • 22px Semi-bold</div>
                </button>

                {/* Body Paragraph */}
                <button
                  type="button"
                  onClick={() => onInsertText(
                    isUrdu
                      ? '<p style="font-size: 16px; margin: 8px 0; line-height: 2.2;">یہاں اپنا تفصیلی پیراگراف تحریر فرمائیں...</p>'
                      : '<p style="font-size: 16px; margin: 8px 0; line-height: 1.6;">Type your body text paragraph here...</p>',
                    true
                  )}
                  className={`w-full p-3 bg-white hover:bg-[#00b7b5]/10 hover:border-[#018790] border border-[#018790]/20 rounded-xl transition cursor-pointer group ${isUrdu ? 'text-right' : 'text-left'}`}
                >
                  <div className={`text-sm text-gray-700 group-hover:text-[#005461] ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                    {isUrdu ? 'عام پیراگراف کا متن' : 'Add Body Text'}
                  </div>
                  <div className="text-[11px] text-gray-400">Body Text • 16px Regular</div>
                </button>

                {/* Fancy Text Launcher */}
                <div className="pt-2 border-t border-[#018790]/20">
                  <button
                    type="button"
                    onClick={onOpenFancyFontsModal}
                    className="w-full py-2.5 px-3 bg-[#018790] hover:bg-[#005461] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isUrdu ? 'اسٹائلش فونٹس و خطاطی پینل' : 'Fancy Fonts & Calligraphy Panel'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: POETRY STUDIO (شاعری اسٹوڈیو)              */}
            {/* ============================================== */}
            {activeTab === 'poetry' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#00b7b5]/15 border border-[#018790]/25 rounded-xl text-xs space-y-1 text-[#005461]">
                  <div className="font-bold flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-[#018790]" />
                    <span>{isUrdu ? 'اردو و فارسی شاعری اسٹوڈیو 👑' : 'Urdu & Poetry Studio 👑'}</span>
                  </div>
                  <p className={`text-[11px] text-[#005461]/85 ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'شعر و شاعری کو دو کالم، خطاطی کالم اور متوازن مصرعوں کے انداز میں درج کریں۔'
                      : 'Format poetry in balanced couplets, dual columns, and calligraphy verses.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenPoetryModal}
                  className="w-full py-3 px-4 bg-[#018790] hover:bg-[#005461] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Feather className="w-4 h-4" />
                  <span>{isUrdu ? 'اوپن شاعری لائبریری و اسٹوڈیو' : 'Open Poetry Library & Studio'}</span>
                </button>

                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pt-2">
                  {isUrdu ? 'فوری کلاسک اشعار کے نمونے:' : 'Classic Poetry Samples:'}
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => onInsertText('<div style="text-align: center; margin: 16px 0; font-family: inherit; font-size: 18px; line-height: 2.2;"><p>ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے</p><p>بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے</p><span style="font-size: 12px; color: #9ca3af;">— مرزا غالب</span></div>', true)}
                    className="p-3 bg-white hover:bg-[#00b7b5]/10 hover:border-[#018790] border border-[#018790]/20 rounded-xl cursor-pointer text-center font-nastaliq text-xs text-gray-800 transition"
                  >
                    <p className="font-semibold text-sm">ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے</p>
                    <p className="text-[10px] text-gray-400 mt-1">{isUrdu ? 'مرزا اسد اللہ خان غالب' : 'Mirza Ghalib'}</p>
                  </div>

                  <div
                    onClick={() => onInsertText('<div style="text-align: center; margin: 16px 0; font-family: inherit; font-size: 18px; line-height: 2.2;"><p>ستاروں سے آگے جہاں اور بھی ہیں</p><p>ابھی عشق کے امتحاں اور بھی ہیں</p><span style="font-size: 12px; color: #9ca3af;">— علامہ اقبال</span></div>', true)}
                    className="p-3 bg-white hover:bg-[#00b7b5]/10 hover:border-[#018790] border border-[#018790]/20 rounded-xl cursor-pointer text-center font-nastaliq text-xs text-gray-800 transition"
                  >
                    <p className="font-semibold text-sm">ستاروں سے آگے جہاں اور بھی ہیں</p>
                    <p className="text-[10px] text-gray-400 mt-1">{isUrdu ? 'علامہ محمد اقبال' : 'Allama Muhammad Iqbal'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: UPLOADS & IMAGES                          */}
            {/* ============================================== */}
            {activeTab === 'uploads' && (
              <div className="space-y-4">
                {/* Upload Button */}
                <div
                  onClick={onTriggerImageUpload}
                  className="border-2 border-dashed border-[#018790]/40 hover:border-[#005461] bg-[#00b7b5]/10 hover:bg-[#00b7b5]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-98 group shadow-2xs"
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-[#018790]/30 flex items-center justify-center text-[#005461] mb-2 group-hover:scale-110 transition shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs text-gray-900">
                    {isUrdu ? 'نئی تصویر منتخب کریں یا اپلوڈ کریں' : 'Upload or Select New Image'}
                  </div>
                  <div className="text-[10px] text-[#005461] mt-0.5">
                    {isUrdu ? 'PNG, JPG, WebP (دستاویز میں شامل ہوگی)' : 'PNG, JPG, WebP (Added to canvas)'}
                  </div>
                </div>

                {/* If an image is currently selected, show rich controls */}
                {selectedImage ? (
                  <div className="p-3.5 bg-white rounded-2xl border-2 border-[#005461] space-y-3 shadow-md animate-in fade-in-50 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#018790]/20">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-[#005461] text-white flex items-center justify-center">
                          <ImageIcon className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-xs text-gray-900">
                          {isUrdu ? 'منتخب تصویر کے کنٹرولز' : 'Selected Image Controls'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#00b7b5]/15 text-[#005461] font-bold font-mono text-[10px] border border-[#018790]/30">
                        {imageWidthPercent}%
                      </span>
                    </div>

                    {/* Resize Stepper & Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-800">
                          {isUrdu ? 'سائز چھوٹا / بڑا کریں:' : 'Resize Image:'}
                        </span>
                        <span className="text-[10px] text-[#005461] font-mono font-bold">
                          {imageWidthPercent}% {isUrdu ? 'چوڑائی' : 'Width'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateImageWidth && onUpdateImageWidth(Math.max(10, imageWidthPercent - 10))}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-[#018790]/20 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95 flex items-center gap-0.5"
                          title={isUrdu ? 'چھوٹا کریں (-10%)' : 'Decrease size (-10%)'}
                        >
                          <Minus className="w-3 h-3" />
                          <span>{isUrdu ? 'چھوٹا' : 'Smaller'}</span>
                        </button>
                        <input
                          type="range"
                          min={15}
                          max={100}
                          step={5}
                          value={imageWidthPercent}
                          onChange={(e) => onUpdateImageWidth && onUpdateImageWidth(parseInt(e.target.value, 10))}
                          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005461]"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateImageWidth && onUpdateImageWidth(Math.min(100, imageWidthPercent + 10))}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-[#018790]/20 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95 flex items-center gap-0.5"
                          title={isUrdu ? 'بڑا کریں (+10%)' : 'Increase size (+10%)'}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isUrdu ? 'بڑا' : 'Bigger'}</span>
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[
                          { pct: 25, label: isUrdu ? '25% چھوٹا' : '25% Small' },
                          { pct: 50, label: isUrdu ? '50% درمیانہ' : '50% Med' },
                          { pct: 75, label: isUrdu ? '75% بڑا' : '75% Large' },
                          { pct: 100, label: isUrdu ? '100% پورا' : '100% Full' }
                        ].map((preset) => (
                          <button
                            key={preset.pct}
                            type="button"
                            onClick={() => onUpdateImageWidth && onUpdateImageWidth(preset.pct)}
                            className={`py-1 text-[10px] font-bold rounded-md border transition text-center ${
                              imageWidthPercent === preset.pct
                                ? 'bg-[#005461] text-white border-[#005461] shadow-2xs'
                                : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Alignment Controls */}
                    <div className="space-y-1.5 pt-1 border-t border-[#018790]/20">
                      <span className="text-[11px] font-bold text-gray-800 block">
                        {isUrdu ? 'الائنمنٹ (جانب رکھیں):' : 'Alignment:'}
                      </span>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateImageAlignment && onUpdateImageAlignment('left')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 transition ${
                            imageAlignment === 'left'
                              ? 'bg-[#005461] text-white border-[#005461] shadow-xs'
                              : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                          }`}
                          title={isUrdu ? 'بائیں جانب کریں (Left)' : 'Align Left'}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'بائیں' : 'Left'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateImageAlignment && onUpdateImageAlignment('center')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 transition ${
                            imageAlignment === 'center'
                              ? 'bg-[#005461] text-white border-[#005461] shadow-xs'
                              : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                          }`}
                          title={isUrdu ? 'درمیان میں کریں (Center)' : 'Align Center'}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'درمیان' : 'Center'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateImageAlignment && onUpdateImageAlignment('right')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 transition ${
                            imageAlignment === 'right'
                              ? 'bg-[#005461] text-white border-[#005461] shadow-xs'
                              : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                          }`}
                          title={isUrdu ? 'دائیں جانب کریں (Right)' : 'Align Right'}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'دائیں' : 'Right'}</span>
                        </button>
                      </div>

                      {/* Text wrap / Float */}
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateImageAlignment && onUpdateImageAlignment('float-left')}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-bold border transition ${
                            imageAlignment === 'float-left'
                              ? 'bg-[#005461] text-white border-[#005461]'
                              : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                          }`}
                        >
                          {isUrdu ? 'متن بائیں بہاؤ' : 'Float Left'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateImageAlignment && onUpdateImageAlignment('float-right')}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-bold border transition ${
                            imageAlignment === 'float-right'
                              ? 'bg-[#005461] text-white border-[#005461]'
                              : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                          }`}
                        >
                          {isUrdu ? 'متن دائیں بہاؤ' : 'Float Right'}
                        </button>
                      </div>
                    </div>

                    {/* Visual Styling: Corners & Effects */}
                    <div className="space-y-1.5 pt-1 border-t border-[#018790]/20">
                      <span className="text-[11px] font-bold text-gray-800 block">
                        {isUrdu ? 'کونے اور سٹائل:' : 'Corners & Styling:'}
                      </span>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {([
                          { id: 'none', label: isUrdu ? 'سیدھا' : 'Sharp' },
                          { id: 'sm', label: isUrdu ? 'ہلکا' : 'Small' },
                          { id: 'md', label: isUrdu ? 'معیاری' : 'Medium' },
                          { id: 'lg', label: isUrdu ? 'گول' : 'Large' },
                          { id: 'full', label: isUrdu ? 'دائرہ' : 'Circle' }
                        ] as const).map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => onUpdateImageRounded && onUpdateImageRounded(r.id)}
                            className={`py-1 text-[10px] rounded-md border transition ${
                              imageRounded === r.id
                                ? 'bg-[#005461] text-white border-[#005461] font-bold'
                                : 'bg-white text-gray-700 border-[#018790]/20 hover:bg-[#00b7b5]/15'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={onToggleImageShadow}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                            imageShadow
                              ? 'bg-[#00b7b5]/20 text-[#005461] border-[#018790]'
                              : 'bg-white text-gray-600 border-[#018790]/20'
                          }`}
                        >
                          <span>{isUrdu ? 'سایہ:' : 'Shadow:'}</span>
                          <span>{imageShadow ? (isUrdu ? 'آن' : 'On') : (isUrdu ? 'بند' : 'Off')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={onToggleImageBorder}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                            imageBorder
                              ? 'bg-[#00b7b5]/20 text-[#005461] border-[#018790]'
                              : 'bg-white text-gray-600 border-[#018790]/20'
                          }`}
                        >
                          <span>{isUrdu ? 'بارڈر:' : 'Border:'}</span>
                          <span>{imageBorder ? (isUrdu ? 'آن' : 'On') : (isUrdu ? 'بند' : 'Off')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Actions: Duplicate & Delete */}
                    <div className="flex items-center gap-1.5 pt-1 border-t border-[#018790]/20">
                      <button
                        type="button"
                        onClick={onDuplicateSelectedImage}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-[#018790]/20 hover:bg-[#00b7b5]/15 text-gray-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#005461]" />
                        <span>{isUrdu ? 'کاپی بنائیں' : 'Duplicate'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={onDeleteSelectedImage}
                        className="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>{isUrdu ? 'تصویر ڈیلیٹ' : 'Delete'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={onDeselectImage}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
                        title={isUrdu ? 'انتخاب ختم کریں' : 'Deselect'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#f4f4f4]/60 rounded-xl border border-[#018790]/20 text-xs space-y-2 text-gray-600">
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#018790]" />
                      <span>{isUrdu ? 'تصویر کو کنٹرول کرنے کا طریقہ:' : 'How to arrange images:'}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                      {isUrdu
                        ? 'صفحے پر موجود کسی بھی تصویر پر کلک کریں تاکہ وہ منتخب ہو جائے، یا نئی تصویر اپلوڈ کریں۔ آپ سائز بٹنوں اور سلائیڈر سے اسے چھوٹا یا بڑا کر سکتے ہیں، اور بائیں جانب، دائیں یا درمیان الائن کر سکتے ہیں!'
                        : 'Click any image on the canvas to select it, or upload a new image. You can resize it smoothly using buttons and slider, align left, right or center, and adjust corners!'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ============================================== */}
            {/* TAB: TOOLS & UTILITIES                         */}
            {/* ============================================== */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                {/* Urdu Keyboard Toggle */}
                <div className="p-3 bg-[#f4f4f4]/60 border border-[#018790]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-[#005461]" />
                      <span className="font-bold text-xs text-gray-800">
                        {isUrdu ? 'اردو فونیٹک کی بورڈ' : 'Urdu Phonetic Keyboard'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUrduKeyboardOpen(!isUrduKeyboardOpen)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        isUrduKeyboardOpen ? 'bg-[#005461] text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isUrduKeyboardOpen ? (isUrdu ? 'فعال ہے' : 'On') : (isUrdu ? 'بند ہے' : 'Off')}
                    </button>
                  </div>
                  <p className={`text-[11px] text-gray-500 ${isUrdu ? 'font-nastaliq' : 'font-sans'}`}>
                    {isUrdu
                      ? 'اسکرین پر ورچوئل کی بورڈ دکھائیں تاکہ بغیر اردو کی بورڈ کے آسانی سے ٹائپ کر سکیں۔'
                      : 'Display on-screen virtual keyboard for quick typing without system Urdu layout.'}
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
                    <span>{isUrdu ? 'پہلے جیسا (Undo)' : 'Undo (Ctrl+Z)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onRedo}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <Redo className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'دوبارہ کریں (Redo)' : 'Redo (Ctrl+Y)'}</span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="p-3 bg-[#f4f4f4]/60 border border-[#018790]/20 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-gray-900">
                    {isUrdu ? 'دستاویز کے اعداد و شمار:' : 'Document Statistics:'}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-[#018790]/20 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-[#005461]">{wordCount}</div>
                      <div className="text-[10px] text-gray-400">{isUrdu ? 'الفاظ' : 'Words'}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#018790]/20 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-[#005461]">{charCount}</div>
                      <div className="text-[10px] text-gray-400">{isUrdu ? 'حروف' : 'Chars'}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#018790]/20 shadow-2xs">
                      <div className="font-mono font-bold text-sm text-[#005461]">{pagesCount}</div>
                      <div className="text-[10px] text-gray-400">{isUrdu ? 'صفحات' : 'Pages'}</div>
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
                    <span className="text-xs font-bold text-gray-900">
                      {isUrdu ? 'ورق کا رنگ' : 'Page Background Color'}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenPageColorModal}
                      className="text-[11px] text-[#018790] font-semibold hover:underline"
                    >
                      {isUrdu ? 'مزید رنگ' : 'More Colors'}
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
                            ? 'ring-2 ring-[#005461] ring-offset-2 border-transparent scale-105'
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
                <div className="pt-2 border-t border-[#018790]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      {isUrdu ? 'صفحہ کا بارڈر / فریم' : 'Page Border & Frame'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasBorder(!hasBorder)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        hasBorder ? 'bg-[#005461] text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {hasBorder ? (isUrdu ? 'آن ہے' : 'On') : (isUrdu ? 'آف ہے' : 'Off')}
                    </button>
                  </div>

                  {hasBorder && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-gray-500">
                        {isUrdu ? 'فریم اسٹائل منتخب کریں:' : 'Select border style:'}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {([
                          { id: 'solid', labelUrdu: 'ٹھوس', labelEn: 'Solid' },
                          { id: 'double', labelUrdu: 'ڈبل', labelEn: 'Double' },
                          { id: 'dashed', labelUrdu: 'ڈیشڈ', labelEn: 'Dashed' },
                          { id: 'dotted', labelUrdu: 'نقطہ دار', labelEn: 'Dotted' },
                          { id: 'corners', labelUrdu: 'کونے', labelEn: 'Corners' },
                          { id: 'royal', labelUrdu: 'شاہی', labelEn: 'Royal' }
                        ] as const).map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setBorderType(b.id)}
                            className={`py-1.5 px-2 rounded-lg border capitalize transition text-center ${
                              borderType === b.id
                                ? 'bg-[#00b7b5]/20 border-[#018790] text-[#005461] font-bold'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {isUrdu ? b.labelUrdu : b.labelEn}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={onOpenBorderModal}
                        className="w-full mt-2 py-2 px-3 bg-[#f4f4f4] hover:bg-[#00b7b5]/15 text-[#005461] font-semibold text-xs rounded-xl border border-[#018790]/25 transition flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'تفصیلی فریم ترتیبات' : 'Customize Border Settings'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sheet Size */}
                <div className="pt-2 border-t border-[#018790]/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {isUrdu ? 'ورق کا سائز' : 'Sheet Size'}
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">{pageSize}</div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPageSizeModal}
                    className="px-2.5 py-1 bg-[#f4f4f4] hover:bg-[#00b7b5]/15 text-[#005461] border border-[#018790]/25 font-semibold text-xs rounded-lg transition"
                  >
                    {isUrdu ? 'تبدیل کریں' : 'Change'}
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
