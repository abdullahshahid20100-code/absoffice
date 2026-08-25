import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Copy,
  Save,
  FileDown,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  ChevronDown,
  Minus,
  Plus,
  Palette,
  FileText,
  Keyboard,
  Check,
  ZoomIn,
  ZoomOut,
  Square,
  FilePlus2,
  Download,
  Printer,
  Trash2,
  SlidersHorizontal,
  X,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { toCanvas, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { SavedDocument, PageSize } from '../types';
import { UrduKeyboard } from './UrduKeyboard';

interface EditorWorkspaceProps {
  initialDocument: SavedDocument;
  onBack: () => void;
  onSave: (doc: SavedDocument) => void;
  onShowToast: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
  onOpenCustomSize: () => void;
}

// Page Dimensions Definition in CSS Pixels (at 96 DPI)
interface SheetDimension {
  width: number;
  height: number;
  label: string;
  pdfFormat: string | [number, number];
}

const PAGE_SIZE_CONFIGS: Record<PageSize, SheetDimension> = {
  A4: { width: 794, height: 1123, label: 'A4 (210 × 297 mm)', pdfFormat: 'a4' },
  Letter: { width: 816, height: 1056, label: 'US Letter (8.5 × 11 in)', pdfFormat: 'letter' },
  Legal: { width: 816, height: 1344, label: 'US Legal (8.5 × 14 in)', pdfFormat: 'legal' },
  A5: { width: 559, height: 794, label: 'A5 Booklet (148 × 210 mm)', pdfFormat: 'a5' },
  Custom: { width: 794, height: 1123, label: 'Custom Dimensions', pdfFormat: 'a4' }
};

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  initialDocument,
  onBack,
  onSave,
  onShowToast,
  onOpenCustomSize
}) => {
  // Document state
  const [docId, setDocId] = useState(initialDocument.id);
  const [title, setTitle] = useState(initialDocument.title || 'Blank Document');
  const [fontFamily, setFontFamily] = useState(initialDocument.fontFamily || 'font-nastaliq');
  const [fontSize, setFontSize] = useState(initialDocument.fontSize || 16);
  const [lineHeight, setLineHeight] = useState(initialDocument.lineHeight || '2.2');
  const [wordSpacing, setWordSpacing] = useState(initialDocument.wordSpacing || 'normal');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>(
    initialDocument.textAlign || 'right'
  );
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(initialDocument.direction || 'rtl');
  const [pageSize, setPageSize] = useState<PageSize>((initialDocument.pageSize as PageSize) || 'A4');
  
  // Custom dimensions state (for dynamic resizing)
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number }>({
    width: 794,
    height: 1123
  });
  const [customWidthInput, setCustomWidthInput] = useState(210);
  const [customHeightInput, setCustomHeightInput] = useState(297);
  const [customUnit, setCustomUnit] = useState<'mm' | 'px' | 'in'>('mm');

  // Active sheet dimensions
  const activeSheetDim = pageSize === 'Custom' 
    ? { width: customDimensions.width, height: customDimensions.height, label: `Custom (${customDimensions.width}×${customDimensions.height}px)`, pdfFormat: [customDimensions.width * 0.75, customDimensions.height * 0.75] as [number, number] }
    : PAGE_SIZE_CONFIGS[pageSize] || PAGE_SIZE_CONFIGS.A4;

  // Frame / Border Options
  const [hasBorder, setHasBorder] = useState(initialDocument.templateId === 'formal-letter' || false);
  const [borderType, setBorderType] = useState<'solid' | 'double' | 'dashed' | 'dotted' | 'corners' | 'royal'>('solid');
  const [borderColorTone, setBorderColorTone] = useState<'dark' | 'light' | 'primary' | 'gold' | 'emerald' | 'crimson' | 'custom'>('dark');
  const [customBorderColor, setCustomBorderColor] = useState('#1e293b');
  const [borderThickness, setBorderThickness] = useState<number>(2);
  const [borderInset, setBorderInset] = useState<number>(24); // px margin from page edge

  // Page numbering inside rectangle options
  const [showPageNumber, setShowPageNumber] = useState(true);
  const [pageNumberPosition, setPageNumberPosition] = useState<'inside' | 'footer'>('inside');
  const [pageNumberFormat, setPageNumberFormat] = useState<'urdu' | 'english' | 'simple'>('urdu');

  // Text Color & Background
  const [textColor, setTextColor] = useState('#1e293b');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Pagination State
  const [pagesCount, setPagesCount] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(1);

  // Live Statistics
  const [wordCount, setWordCount] = useState(initialDocument.wordCount || 0);
  const [charCount, setCharCount] = useState(initialDocument.charCount || 0);
  const [charNoSpacesCount, setCharNoSpacesCount] = useState(0);
  const [paragraphsCount, setParagraphsCount] = useState(1);

  // Modals & Popovers States (Using clear overlays that never get clipped)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isBorderModalOpen, setIsBorderModalOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isUrduKeyboardOpen, setIsUrduKeyboardOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');

  // Image Inspector / Control State
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imageWidthPercent, setImageWidthPercent] = useState<number>(50);
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'right' | 'float-left' | 'float-right'>('center');
  const [imageRounded, setImageRounded] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');
  const [imageShadow, setImageShadow] = useState<boolean>(true);
  const [imageBorder, setImageBorder] = useState<boolean>(false);

  // Gallery Save Preview Modal
  const [galleryModalImage, setGalleryModalImage] = useState<string | null>(null);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });
  const [currentBlockTag, setCurrentBlockTag] = useState<'p' | 'h1' | 'h2' | 'h3' | 'blockquote' | 'pre'>('p');

  const editorRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceScrollRef = useRef<HTMLElement>(null);

  // Calculate dynamic multi-page count and live stats accurately
  const recalculatePagination = useCallback(() => {
    if (!editorRef.current) return;
    const contentEl = editorRef.current;
    const sheetHeight = activeSheetDim.height;
    const sheetGap = 40; // matches mb-10 (40px)
    const pagePitch = sheetHeight + sheetGap;
    const safeTop = hasBorder ? Math.max(62, borderInset + 40) : 48;
    const safeBottom = hasBorder ? Math.max(76, borderInset + 54) : 48;

    // Direct text container inner children (top-level elements)
    const children = Array.from(contentEl.children) as HTMLElement[];
    
    // Clear any previous invalid inline margin styles if content is within page
    children.forEach((child) => {
      if (child.getAttribute('data-page-break') === 'true' || child.classList.contains('document-page-break-section')) {
        return;
      }
      
      // Calculate child position without its extra margin
      const currentMargin = parseInt(child.style.marginTop || '0', 10) || 0;
      const baseTop = child.offsetTop - currentMargin;
      const childHeight = child.offsetHeight;
      const baseBottom = baseTop + childHeight;
      
      const pageIndex = Math.floor(baseTop / pagePitch);
      const sheetLimit = pageIndex * pagePitch + sheetHeight - safeBottom;
      const nextSheetTop = (pageIndex + 1) * pagePitch + safeTop;

      if (baseBottom > sheetLimit) {
        // Must jump to next page
        const neededMargin = Math.max(0, nextSheetTop - baseTop);
        if (child.style.marginTop !== `${neededMargin}px`) {
          child.style.marginTop = `${neededMargin}px`;
        }
      } else {
        if (child.style.marginTop) {
          child.style.marginTop = '';
        }
      }
    });

    const currentHeight = contentEl.scrollHeight;
    const pageBreaks = contentEl.querySelectorAll('[data-page-break="true"]').length;
    const calculatedPages = Math.max(1 + pageBreaks, Math.max(1, Math.ceil((currentHeight - 20) / pagePitch)));
    setPagesCount(calculatedPages);

    // Live text statistics
    const rawText = contentEl.innerText || '';
    const cleanText = rawText.trim();
    
    // Words count (splitting on whitespace & punctuation)
    const words = cleanText ? cleanText.split(/[\s\n\r\t\u2000-\u200B\u00A0]+/).filter(Boolean).length : 0;
    const chars = rawText.length;
    const charsNoSpaces = rawText.replace(/\s+/g, '').length;
    
    // Paragraphs count
    const paragraphs = rawText.split(/\n+/).filter((p) => p.trim().length > 0).length || 1;

    setWordCount(words);
    setCharCount(chars);
    setCharNoSpacesCount(charsNoSpaces);
    setParagraphsCount(paragraphs);
  }, [activeSheetDim.height, hasBorder, borderInset]);

  // Set initial content and attach image click listeners
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialDocument.content;
      recalculatePagination();
    }
  }, [initialDocument.content, recalculatePagination]);

  // MutationObserver on editorRef to update word count and pagination on ANY change
  useEffect(() => {
    if (!editorRef.current) return;
    const observer = new MutationObserver(() => {
      recalculatePagination();
      attachImageListeners();
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [recalculatePagination]);

  // Track active page on scroll
  const handleScroll = () => {
    if (!workspaceScrollRef.current) return;
    const scrollTop = workspaceScrollRef.current.scrollTop;
    const pageGapHeight = (activeSheetDim.height + 40) * (zoomLevel / 100);
    const currentPage = Math.min(pagesCount, Math.max(1, Math.floor((scrollTop + 150) / pageGapHeight) + 1));
    setActivePageIndex(currentPage);
  };

  // Check active format states on selection and detect active heading/block & font size
  const checkActiveFormats = () => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough')
      });
    } catch {
      // Ignore queryCommandState issues in edge environments
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement) {
          const tag = node.tagName.toLowerCase();
          if (['h1', 'h2', 'h3', 'p', 'blockquote', 'pre'].includes(tag)) {
            setCurrentBlockTag(tag as any);
            break;
          }
          if (node.style && node.style.fontSize) {
            const pxSize = parseInt(node.style.fontSize, 10);
            if (pxSize && !isNaN(pxSize)) {
              setFontSize(pxSize);
            }
          }
        }
        node = node.parentNode;
      }
    }
  };

  // Image Selection and Interaction Listener
  const attachImageListeners = useCallback(() => {
    if (!editorRef.current) return;
    const images = editorRef.current.querySelectorAll('img');
    images.forEach((img) => {
      img.style.cursor = 'pointer';
      img.onclick = (e) => {
        e.stopPropagation();
        setSelectedImage(img);

        // Highlight selected image with subtle outline
        images.forEach(i => (i.style.outline = 'none'));
        img.style.outline = '3px solid #2563eb';
        img.style.outlineOffset = '3px';

        // Read current inline styles of the image
        const currentWidth = img.style.width || '50%';
        if (currentWidth.endsWith('%')) {
          setImageWidthPercent(parseInt(currentWidth) || 50);
        } else if (currentWidth.endsWith('px')) {
          const pxVal = parseInt(currentWidth);
          const pct = Math.round((pxVal / activeSheetDim.width) * 100);
          setImageWidthPercent(Math.min(100, Math.max(10, pct)));
        }

        if (img.style.float === 'left') setImageAlignment('float-left');
        else if (img.style.float === 'right') setImageAlignment('float-right');
        else if (img.style.display === 'block' && img.style.margin === '0px auto') setImageAlignment('center');
        else if (img.style.display === 'block' && img.style.marginRight === 'auto') setImageAlignment('left');
        else if (img.style.display === 'block' && img.style.marginLeft === 'auto') setImageAlignment('right');
      };
    });
  }, [activeSheetDim.width]);

  useEffect(() => {
    attachImageListeners();
  }, [attachImageListeners]);

  // Click outside to deselect image outline
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#image-inspector-panel') && target.tagName !== 'IMG') {
        if (selectedImage) {
          selectedImage.style.outline = 'none';
        }
        setSelectedImage(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [selectedImage]);

  // Update selected image styling when controls change
  const applyImageStyles = (
    widthPct: number,
    align: 'left' | 'center' | 'right' | 'float-left' | 'float-right',
    rounded: 'none' | 'sm' | 'md' | 'lg' | 'full',
    shadow: boolean,
    border: boolean
  ) => {
    if (!selectedImage) return;

    selectedImage.style.width = `${widthPct}%`;
    selectedImage.style.maxWidth = '100%';
    selectedImage.style.height = 'auto';

    // Alignment / Positioning
    if (align === 'float-left') {
      selectedImage.style.float = 'left';
      selectedImage.style.display = 'inline-block';
      selectedImage.style.margin = '8px 16px 8px 0';
    } else if (align === 'float-right') {
      selectedImage.style.float = 'right';
      selectedImage.style.display = 'inline-block';
      selectedImage.style.margin = '8px 0 8px 16px';
    } else if (align === 'center') {
      selectedImage.style.float = 'none';
      selectedImage.style.display = 'block';
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = 'auto';
      selectedImage.style.marginTop = '12px';
      selectedImage.style.marginBottom = '12px';
    } else if (align === 'left') {
      selectedImage.style.float = 'none';
      selectedImage.style.display = 'block';
      selectedImage.style.marginLeft = '0';
      selectedImage.style.marginRight = 'auto';
      selectedImage.style.marginTop = '12px';
      selectedImage.style.marginBottom = '12px';
    } else if (align === 'right') {
      selectedImage.style.float = 'none';
      selectedImage.style.display = 'block';
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = '0';
      selectedImage.style.marginTop = '12px';
      selectedImage.style.marginBottom = '12px';
    }

    // Border Radius
    if (rounded === 'none') selectedImage.style.borderRadius = '0px';
    else if (rounded === 'sm') selectedImage.style.borderRadius = '4px';
    else if (rounded === 'md') selectedImage.style.borderRadius = '8px';
    else if (rounded === 'lg') selectedImage.style.borderRadius = '16px';
    else if (rounded === 'full') selectedImage.style.borderRadius = '9999px';

    // Shadow
    selectedImage.style.boxShadow = shadow ? '0 4px 12px rgba(0,0,0,0.15)' : 'none';

    // Border
    selectedImage.style.border = border ? '2px solid #cbd5e1' : 'none';

    recalculatePagination();
  };

  // Delete selected image
  const handleDeleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      recalculatePagination();
      onShowToast({
        type: 'info',
        title: 'Image Removed',
        description: 'Image deleted from document.'
      });
    }
  };

  // Generic document command executor
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      checkActiveFormats();
      recalculatePagination();
      setTimeout(attachImageListeners, 50);
    }
  };

  // Text formatting
  const handleBold = () => executeCommand('bold');
  const handleItalic = () => executeCommand('italic');
  const handleUnderline = () => executeCommand('underline');

  const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    setTextAlign(align);
    if (align === 'left') executeCommand('justifyLeft');
    if (align === 'center') executeCommand('justifyCenter');
    if (align === 'right') executeCommand('justifyRight');
    if (align === 'justify') executeCommand('justifyFull');
  };

  const handleList = (type: 'ordered' | 'unordered') => {
    if (type === 'ordered') executeCommand('insertOrderedList');
    if (type === 'unordered') executeCommand('insertUnorderedList');
  };

  const handleFontFamilyChange = (fontClass: string) => {
    setFontFamily(fontClass);
    executeCommand('fontName', fontClass);
  };

  const handleFontStyleChange = (styleType: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    try {
      if (styleType === 'p') {
        document.execCommand('formatBlock', false, '<p>');
      } else if (styleType === 'h1') {
        document.execCommand('formatBlock', false, '<h1>');
      } else if (styleType === 'h2') {
        document.execCommand('formatBlock', false, '<h2>');
      } else if (styleType === 'h3') {
        document.execCommand('formatBlock', false, '<h3>');
      } else if (styleType === 'blockquote') {
        document.execCommand('formatBlock', false, '<blockquote>');
      } else if (styleType === 'pre') {
        document.execCommand('formatBlock', false, '<pre>');
      }
    } catch (e) {
      console.warn('formatBlock error:', e);
    }

    setCurrentBlockTag(styleType as any);
    checkActiveFormats();
    setTimeout(recalculatePagination, 50);
  };

  // Precise font size handler - ONLY applies to selected text if text is selected, else sets default
  const applyFontSize = (targetSize: number) => {
    const clampedSize = Math.max(10, Math.min(72, targetSize));
    setFontSize(clampedSize);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      // No text highlighted, set base editor font size
      if (editorRef.current) {
        editorRef.current.style.fontSize = `${clampedSize}px`;
      }
      setTimeout(recalculatePagination, 50);
      return;
    }

    const range = sel.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    // Check if the selected text is already entirely wrapped in a span
    const startNode = range.startContainer;
    const endNode = range.endContainer;
    const startParent = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : (startNode as HTMLElement);
    const endParent = endNode.nodeType === Node.TEXT_NODE ? endNode.parentElement : (endNode as HTMLElement);

    if (
      startParent &&
      startParent === endParent &&
      startParent.tagName === 'SPAN' &&
      range.toString().trim() === (startParent.textContent || '').trim()
    ) {
      startParent.style.fontSize = `${clampedSize}px`;
      const newRange = document.createRange();
      newRange.selectNodeContents(startParent);
      sel.removeAllRanges();
      sel.addRange(newRange);
      setTimeout(recalculatePagination, 50);
      return;
    }

    // Wrap the selected range in a styled span
    try {
      const extracted = range.extractContents();
      const span = document.createElement('span');
      span.style.fontSize = `${clampedSize}px`;
      span.appendChild(extracted);
      range.insertNode(span);

      // Re-highlight the newly created span so consecutive +/- clicks work smoothly
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } catch (e) {
      console.warn('Font size selection wrap fallback:', e);
    }

    setTimeout(recalculatePagination, 50);
  };

  const handleFontSizeChange = (delta: number) => {
    applyFontSize(fontSize + delta);
  };

  const handleDirectFontSizeChange = (newSize: number) => {
    applyFontSize(newSize);
  };

  // Instant 1-click language mode switch for Urdu / English
  const handleLanguageMode = (mode: 'urdu' | 'english') => {
    if (mode === 'english') {
      setDirection('ltr');
      setTextAlign('left');
      setLineHeight('1.6');
      if (
        fontFamily.includes('nastaliq') ||
        fontFamily.includes('gulzar') ||
        fontFamily.includes('scheherazade') ||
        fontFamily.includes('amiri') ||
        fontFamily.includes('lateef')
      ) {
        setFontFamily('font-sans-custom');
      }
      onShowToast({
        type: 'info',
        title: 'English Mode Activated / انگریزی موڈ',
        description: 'Left-to-Right layout with standard English typography enabled.'
      });
    } else {
      setDirection('rtl');
      setTextAlign('right');
      setLineHeight('2.2');
      setFontFamily('font-nastaliq');
      onShowToast({
        type: 'info',
        title: 'Urdu Mode Activated / اردو موڈ',
        description: 'Right-to-Left layout with classic Nastaliq calligraphy enabled.'
      });
    }
    setTimeout(recalculatePagination, 50);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    executeCommand('foreColor', color);
    setIsColorPickerOpen(false);
  };

  const handleInsertChar = (char: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (char === '\n') {
      document.execCommand('insertParagraph', false);
    } else {
      document.execCommand('insertText', false, char);
    }
    recalculatePagination();
  };

  // Manual Add Page / Page Break insertion - adds new page sheet directly below
  const handleAddPage = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const contentEl = editorRef.current;
    const sheetHeight = activeSheetDim.height;
    const sheetGap = 40; // matches mb-10 (40px)
    const pagePitch = sheetHeight + sheetGap;
    const safeTop = hasBorder ? Math.max(62, borderInset + 40) : 48; // 1-2 lines below frame

    // Current total height of content in editor
    const currentHeight = contentEl.scrollHeight;
    
    // Determine which page sheet the current content ends on
    const currentPageIndex = Math.floor(Math.max(0, currentHeight - safeTop) / pagePitch);
    
    // Exact Y-position where text should start on the next sheet below (1-2 lines below top frame)
    const targetY = (currentPageIndex + 1) * pagePitch + safeTop;
    const spacerHeight = Math.max(40, targetY - currentHeight);

    // Create wrapper for the page break
    const pageBreakWrapper = document.createElement('div');
    pageBreakWrapper.className = 'document-page-break-section';
    pageBreakWrapper.setAttribute('data-page-break', 'true');
    
    // Transparent spacer that jumps to the top margin of the next sheet
    const spacerEl = document.createElement('div');
    spacerEl.className = 'page-gap-spacer';
    spacerEl.style.cssText = `height: ${spacerHeight}px; pointer-events: none; user-select: none;`;
    pageBreakWrapper.appendChild(spacerEl);

    // New paragraph on the next sheet
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = '<br>';

    editorRef.current.appendChild(pageBreakWrapper);
    editorRef.current.appendChild(newParagraph);

    // Place cursor cleanly at the start of the next page
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(newParagraph, 0);
    range.collapse(true);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    recalculatePagination();

    onShowToast({
      type: 'success',
      title: 'New Page Added (نیا صفحہ شامل کیا گیا)',
      description: `Page ${currentPageIndex + 2} is ready below.`
    });

    setTimeout(() => {
      if (workspaceScrollRef.current) {
        workspaceScrollRef.current.scrollTo({
          top: (targetY - 60) * (zoomLevel / 100),
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Delete/Remove specific Page or Last Page
  const handleDeletePage = (pageIndexToRemove?: number) => {
    if (!editorRef.current) return;
    const contentEl = editorRef.current;
    const pageBreaks = Array.from(contentEl.querySelectorAll('[data-page-break="true"]'));

    if (pageBreaks.length === 0 && pagesCount <= 1) {
      onShowToast({
        type: 'info',
        title: 'Cannot Delete Single Page',
        description: 'Document must contain at least 1 page.'
      });
      return;
    }

    if (pageBreaks.length > 0) {
      // Remove specific page break or the last page break
      const breakToRemove = (pageIndexToRemove !== undefined && pageIndexToRemove > 0 && pageBreaks[pageIndexToRemove - 1])
        ? (pageBreaks[pageIndexToRemove - 1] as HTMLElement)
        : (pageBreaks[pageBreaks.length - 1] as HTMLElement);

      if (breakToRemove && breakToRemove.parentNode) {
        // Also remove any empty trailing paragraph immediately after it
        const nextElem = breakToRemove.nextElementSibling as HTMLElement | null;
        if (nextElem && (nextElem.tagName === 'P' || nextElem.tagName === 'DIV') && (nextElem.innerHTML === '<br>' || nextElem.innerText.trim() === '')) {
          nextElem.parentNode?.removeChild(nextElem);
        }
        breakToRemove.parentNode.removeChild(breakToRemove);
      }
    } else {
      // If multi-page without explicit manual breaks, trim empty lines or trailing elements
      const children = Array.from(contentEl.children);
      for (let i = children.length - 1; i >= 0; i--) {
        const el = children[i] as HTMLElement;
        if (el.innerText.trim() === '' || el.innerHTML === '<br>') {
          el.remove();
        } else {
          break;
        }
      }
    }

    recalculatePagination();

    onShowToast({
      type: 'success',
      title: 'Page Deleted (صفحہ حذف کر دیا گیا)',
      description: `Updated document to ${Math.max(1, pagesCount - 1)} page(s).`
    });
  };

  // Image insertion with default centered format and instant selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url && editorRef.current) {
          editorRef.current.focus();
          const imgHtml = `<img src="${url}" style="display: block; margin: 16px auto; width: 60%; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;" alt="User Image" />`;
          document.execCommand('insertHTML', false, imgHtml);
          
          onShowToast({
            type: 'success',
            title: 'Image Inserted Successfully',
            description: 'Click on the image to resize or change position.'
          });

          setTimeout(() => {
            recalculatePagination();
            attachImageListeners();
            // Automatically select the newly inserted image
            const images = editorRef.current?.querySelectorAll('img');
            if (images && images.length > 0) {
              const lastImg = images[images.length - 1] as HTMLImageElement;
              setSelectedImage(lastImg);
              lastImg.style.outline = '3px solid #2563eb';
              lastImg.style.outlineOffset = '3px';
              setImageWidthPercent(60);
              setImageAlignment('center');
            }
          }, 100);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // Action: Copy Text
  const handleCopy = () => {
    if (!editorRef.current) return;
    const plainText = editorRef.current.innerText || '';
    navigator.clipboard.writeText(plainText);
    onShowToast({
      type: 'success',
      title: 'Copied to Clipboard!',
      description: `Copied ${wordCount} words across ${pagesCount} page(s).`
    });
  };

  // Action: Save Document
  const handleSave = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const updatedDoc: SavedDocument = {
      id: docId,
      title: title.trim() || 'Untitled Document',
      content,
      templateId: initialDocument.templateId || 'blank',
      fontFamily,
      fontSize,
      lineHeight,
      wordSpacing,
      textAlign,
      direction,
      pageSize,
      updatedAt: Date.now(),
      wordCount,
      charCount
    };

    onSave(updatedDoc);
    onShowToast({
      type: 'success',
      title: 'Document Saved!',
      description: `"${title}" saved successfully.`
    });
  };

  // ==========================================
  // DIRECT PDF EXPORT (High-Res Multi-Page jsPDF)
  // ==========================================
  const handleDirectPDFDownload = async () => {
    if (!documentContainerRef.current) return;
    setIsExporting(true);
    setExportProgressText('Preparing high-res PDF...');
    setIsDownloadMenuOpen(false);
    
    // Clear selection outline
    if (selectedImage) {
      selectedImage.style.outline = 'none';
      setSelectedImage(null);
    }

    onShowToast({
      type: 'info',
      title: 'Generating PDF...',
      description: 'Rendering high-resolution document pages.'
    });

    const containerEl = documentContainerRef.current;
    const pageSheets = Array.from(containerEl.querySelectorAll('.msword-page-sheet')) as HTMLElement[];
    const origStyles = pageSheets.map(sheet => ({
      shadow: sheet.style.boxShadow,
      margin: sheet.style.marginBottom
    }));

    try {
      // Temporarily strip shadows & inter-page gaps for a 100% clean, seamless snapshot
      pageSheets.forEach(sheet => {
        sheet.style.boxShadow = 'none';
        sheet.style.marginBottom = '0px';
      });

      const exportFilter = (node: HTMLElement) => {
        if (node.classList && (
          node.classList.contains('no-print') ||
          node.classList.contains('page-delete-btn') ||
          node.getAttribute('data-no-export') === 'true' ||
          node.tagName === 'BUTTON'
        )) {
          return false;
        }
        return true;
      };

      const canvas = await toCanvas(containerEl, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        filter: exportFilter as any
      });

      const pdf = new jsPDF({
        orientation: activeSheetDim.width > activeSheetDim.height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: activeSheetDim.pdfFormat as any
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const totalCanvasPages = pagesCount;
      const singlePageCanvasHeight = canvas.height / totalCanvasPages;

      for (let p = 0; p < totalCanvasPages; p++) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = singlePageCanvasHeight;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            p * singlePageCanvasHeight,
            canvas.width,
            singlePageCanvasHeight,
            0,
            0,
            canvas.width,
            singlePageCanvasHeight
          );

          const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
          if (p > 0) {
            pdf.addPage(activeSheetDim.pdfFormat as any, activeSheetDim.width > activeSheetDim.height ? 'landscape' : 'portrait');
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
      }

      const safeTitle = (title.trim() || 'Urdu-Document').replace(/[/\\?%*:|"<>]/g, '_');
      pdf.save(`${safeTitle}.pdf`);

      onShowToast({
        type: 'success',
        title: 'PDF Downloaded Successfully!',
        description: `Saved "${safeTitle}.pdf" (${totalCanvasPages} page${totalCanvasPages > 1 ? 's' : ''}).`
      });
    } catch (err) {
      console.error('PDF Export Error:', err);
      onShowToast({
        type: 'error',
        title: 'PDF Download',
        description: 'Opening system print dialogue.'
      });
      window.print();
    } finally {
      // Restore original visual styles in editor workspace
      pageSheets.forEach((sheet, idx) => {
        if (origStyles[idx]) {
          sheet.style.boxShadow = origStyles[idx].shadow;
          sheet.style.marginBottom = origStyles[idx].margin;
        }
      });
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // ==========================================
  // SAVE IMAGE TO GALLERY (PNG + Preview Modal)
  // ==========================================
  const handleDirectImageDownload = async () => {
    if (!documentContainerRef.current) return;
    setIsExporting(true);
    setExportProgressText('Rendering HD Image...');
    setIsDownloadMenuOpen(false);
    
    if (selectedImage) {
      selectedImage.style.outline = 'none';
      setSelectedImage(null);
    }

    onShowToast({
      type: 'info',
      title: 'Saving to Gallery...',
      description: 'Rendering HD image for photos.'
    });

    const containerEl = documentContainerRef.current;
    const pageSheets = Array.from(containerEl.querySelectorAll('.msword-page-sheet')) as HTMLElement[];
    const origStyles = pageSheets.map(sheet => ({
      shadow: sheet.style.boxShadow,
      margin: sheet.style.marginBottom
    }));

    try {
      pageSheets.forEach(sheet => {
        sheet.style.boxShadow = 'none';
        sheet.style.marginBottom = '0px';
      });

      const exportFilter = (node: HTMLElement) => {
        if (node.classList && (
          node.classList.contains('no-print') ||
          node.classList.contains('page-delete-btn') ||
          node.getAttribute('data-no-export') === 'true' ||
          node.tagName === 'BUTTON'
        )) {
          return false;
        }
        return true;
      };

      const dataUrl = await toPng(containerEl, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        filter: exportFilter as any
      });

      // 1. Direct Anchor Download
      const link = document.createElement('a');
      const safeTitle = (title.trim() || 'Urdu-Document').replace(/[/\\?%*:|"<>]/g, '_');
      link.download = `${safeTitle}-gallery.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Open Gallery Save Modal for mobile one-touch save
      setGalleryModalImage(dataUrl);

      onShowToast({
        type: 'success',
        title: 'Image Downloaded!',
        description: `Saved "${safeTitle}-gallery.png" to Gallery.`
      });
    } catch (err) {
      console.error('Image Export Error:', err);
      onShowToast({
        type: 'error',
        title: 'Image Export Failed',
        description: 'Please try downloading as PDF or printing.'
      });
    } finally {
      pageSheets.forEach((sheet, idx) => {
        if (origStyles[idx]) {
          sheet.style.boxShadow = origStyles[idx].shadow;
          sheet.style.marginBottom = origStyles[idx].margin;
        }
      });
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // Native Print Dialog
  const handlePrint = () => {
    setIsDownloadMenuOpen(false);
    window.print();
  };

  // Color palette options
  const colorPalette = [
    { label: 'Dark Charcoal', hex: '#1e293b' },
    { label: 'Pitch Black', hex: '#000000' },
    { label: 'Sapphire Blue', hex: '#2563eb' },
    { label: 'Navy Blue', hex: '#1e3a8a' },
    { label: 'Emerald Green', hex: '#059669' },
    { label: 'Crimson Red', hex: '#dc2626' },
    { label: 'Amber Gold', hex: '#d97706' },
    { label: 'Royal Purple', hex: '#7c3aed' },
    { label: 'Deep Teal', hex: '#0d9488' },
    { label: 'Slate Gray', hex: '#64748b' }
  ];

  // Resolve actual border color string
  const resolvedBorderColor = () => {
    if (borderColorTone === 'dark') return '#1e293b';
    if (borderColorTone === 'light') return '#cbd5e1';
    if (borderColorTone === 'primary') return '#2563eb';
    if (borderColorTone === 'gold') return '#b45309';
    if (borderColorTone === 'emerald') return '#059669';
    if (borderColorTone === 'crimson') return '#dc2626';
    return customBorderColor;
  };

  // Format page number label
  const renderPageNumberString = (pageNumber: number, total: number) => {
    if (pageNumberFormat === 'urdu') {
      const urduNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const toUrdu = (n: number) => n.toString().split('').map(d => urduNums[parseInt(d)] || d).join('');
      return `صفحہ ${toUrdu(pageNumber)} از ${toUrdu(total)}`;
    }
    if (pageNumberFormat === 'simple') {
      return `${pageNumber} / ${total}`;
    }
    return `Page ${pageNumber} of ${total}`;
  };

  // Quick Page Size Change handler
  const handlePageSizeChange = (newSize: PageSize) => {
    setPageSize(newSize);
    if (newSize !== 'Custom') {
      setIsPageSizeOpen(false);
      onShowToast({
        type: 'info',
        title: `Page Size Changed to ${newSize}`,
        description: `Sheet dimensions updated: ${PAGE_SIZE_CONFIGS[newSize].label}`
      });
      setTimeout(recalculatePagination, 100);
    }
  };

  // Apply custom width & height directly in editor
  const handleApplyCustomDimensions = () => {
    let wPx = customWidthInput;
    let hPx = customHeightInput;

    if (customUnit === 'mm') {
      wPx = Math.round(customWidthInput * 3.7795); // 1mm = ~3.78px
      hPx = Math.round(customHeightInput * 3.7795);
    } else if (customUnit === 'in') {
      wPx = Math.round(customWidthInput * 96);
      hPx = Math.round(customHeightInput * 96);
    }

    setCustomDimensions({ width: Math.max(300, wPx), height: Math.max(300, hPx) });
    setPageSize('Custom');
    setIsPageSizeOpen(false);

    onShowToast({
      type: 'success',
      title: 'Custom Dimensions Applied',
      description: `Set canvas to ${customWidthInput} × ${customHeightInput} ${customUnit}`
    });
    setTimeout(recalculatePagination, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1e293b] text-gray-900 select-none">
      {/* ==================================================== */}
      {/* 1. TOP STICKY BAR CONTAINER (HEADER + TOOLBAR)       */}
      {/* ==================================================== */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs no-print">
        {/* Top Header Bar */}
        <header className="px-3 sm:px-6 py-2 flex items-center justify-between border-b border-gray-100">
          {/* Left: Back button, Logo, Editable Title, Live Page Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
            <button
              id="editor-btn-back"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <span className="font-bold text-sm">اردو</span>
            </div>

            {/* Editable Title */}
            <input
              id="editor-input-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Document"
              className="font-bold text-gray-900 text-sm sm:text-base bg-transparent hover:bg-gray-100 focus:bg-white border border-transparent focus:border-blue-400 rounded-lg px-2 py-1 max-w-[140px] sm:max-w-xs md:max-w-md focus:outline-none focus:ring-2 focus:ring-blue-100 transition truncate"
            />

            {/* Active Sheet Badge */}
            <button
              onClick={() => setIsPageSizeOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-gray-200 transition shrink-0"
              title="Click to change page size"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeSheetDim.label}</span>
            </button>
          </div>

          {/* Right Action Buttons: Copy, Save, Direct Download */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              id="editor-btn-copy"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-2xs transition active:scale-98"
              title="Copy all text"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              id="editor-btn-save"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs shadow-blue-500/20 transition active:scale-98"
              title="Save changes"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            {/* Download / Export Button */}
            <button
              id="editor-btn-download-menu"
              onClick={() => setIsDownloadMenuOpen(true)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs shadow-emerald-600/20 transition active:scale-98 disabled:opacity-50"
              title="Export to PDF, Gallery PNG, or Print"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{exportProgressText || 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download / محفوظ</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Formatting Toolbar */}
        <div className="px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-2.5 overflow-x-auto text-sm shadow-2xs">
        {/* Quick Language Switcher: Urdu / English */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-300 shrink-0">
          <button
            id="toolbar-lang-urdu"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleLanguageMode('urdu')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
              direction === 'rtl'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Switch to Urdu Mode (اردو نستعلیق - دائیں سے بائیں)"
          >
            <span>🇵🇰</span>
            <span>اردو</span>
          </button>
          <button
            id="toolbar-lang-english"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleLanguageMode('english')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
              direction === 'ltr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Switch to English Mode (Left-to-Right clean text)"
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-gray-200 shrink-0" />

        {/* Font Style / Heading Dropdown */}
        <div className="relative shrink-0">
          <select
            id="toolbar-font-style"
            value={currentBlockTag}
            onChange={(e) => handleFontStyleChange(e.target.value)}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-7 appearance-none"
          >
            <option value="p">Paragraph / سادہ تحریر</option>
            <option value="h1">Heading 1 / بڑی سرخی (H1)</option>
            <option value="h2">Heading 2 / درمیانی سرخی (H2)</option>
            <option value="h3">Heading 3 / چھوٹی سرخی (H3)</option>
            <option value="blockquote">Quote / اقتباس و شعر</option>
            <option value="pre">Code / کمپیوٹر اسکرپٹ</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Font Family Dropdown */}
        <div className="relative shrink-0">
          <select
            id="toolbar-font-family"
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-6 appearance-none max-w-[170px] sm:max-w-[200px]"
          >
            <optgroup label="اردو اور عربی فونٹس (Urdu & Arabic)">
              <option value="font-nastaliq">نستعلیق کلاسیک (Nastaliq)</option>
              <option value="font-gulzar">گلزار خطاطی (Gulzar)</option>
              <option value="font-lateef">لطیف خوشخط (Lateef)</option>
              <option value="font-scheherazade">شہرزاد روایتی (Scheherazade)</option>
              <option value="font-amiri">امیری نسخ (Amiri Naskh)</option>
              <option value="font-arabic-sans">نوٹو عربک سادہ (Noto Sans)</option>
            </optgroup>

            <optgroup label="✨ انگریزی اور جدید فونٹس (English & Modern)">
              <option value="font-sans-custom">Plus Jakarta Sans (Standard English)</option>
              <option value="font-serif-custom">Times New Roman (Formal Serif)</option>
              <option value="font-playfair">Playfair Display (Luxury Serif)</option>
              <option value="font-montserrat">Montserrat (Modern Clean)</option>
              <option value="font-oswald">Oswald (Bold Headline)</option>
              <option value="font-cinzel">Cinzel (Royal Roman)</option>
              <option value="font-mono-custom">Typewriter (Monospace)</option>
            </optgroup>

            <optgroup label="✍️ تحریری اور خطاطی فونٹس (Handwriting & Cursive)">
              <option value="font-caveat">Caveat (Casual Handwriting)</option>
              <option value="font-dancing">Dancing Script (Cursive)</option>
              <option value="font-great-vibes">Great Vibes (Signature Script)</option>
              <option value="font-pacifico">Pacifico (Brush Script)</option>
              <option value="font-sacramento">Sacramento (Delicate Script)</option>
              <option value="font-alex-brush">Alex Brush (Calligraphy)</option>
              <option value="font-kalam">Kalam (Marker Hand-drawn)</option>
              <option value="font-indie-flower">Indie Flower (Casual Pen)</option>
            </optgroup>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Font Size Selector & Stepper [-] [Size Dropdown] [+] */}
        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden shrink-0 shadow-2xs">
          <button
            id="toolbar-font-size-minus"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(-1)}
            className="px-2 py-1.5 hover:bg-gray-200 text-gray-600 transition"
            title="Decrease font size (چھوٹا کریں)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <select
            id="toolbar-font-size-select"
            value={fontSize}
            onChange={(e) => handleDirectFontSizeChange(parseInt(e.target.value, 10))}
            className="bg-white border-x border-gray-300 px-2 py-1 text-xs sm:text-sm font-mono font-semibold text-gray-800 focus:outline-none cursor-pointer appearance-none text-center min-w-[42px]"
            title="Selected Text Font Size (سائز منتخب کریں)"
          >
            {[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            id="toolbar-font-size-plus"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(1)}
            className="px-2 py-1.5 hover:bg-gray-200 text-gray-600 transition"
            title="Increase font size (بڑا کریں)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Color Picker Button */}
        <button
          id="toolbar-btn-color"
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsColorPickerOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 border border-gray-300 flex flex-col items-center justify-center transition bg-gray-50 shrink-0"
          title="Text Color / رنگ منتخب کریں"
        >
          <span className="font-serif font-bold text-sm leading-none">A</span>
          <div className="w-4 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: textColor }} />
        </button>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-gray-200 shrink-0" />

        {/* Formatting: Bold, Italic, Underline */}
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-0.5 shrink-0">
          <button
            id="toolbar-btn-bold"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBold}
            className={`p-1.5 rounded-md transition ${
              activeFormats.bold ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            id="toolbar-btn-italic"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleItalic}
            className={`p-1.5 rounded-md transition ${
              activeFormats.italic ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            id="toolbar-btn-underline"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleUnderline}
            className={`p-1.5 rounded-md transition ${
              activeFormats.underline ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-0.5 shrink-0">
          <button
            id="toolbar-align-left"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAlign('left')}
            className={`p-1.5 rounded-md transition ${
              textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Align Left (بائیں جانب)"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            id="toolbar-align-center"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAlign('center')}
            className={`p-1.5 rounded-md transition ${
              textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Align Center (درمیان میں)"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            id="toolbar-align-right"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAlign('right')}
            className={`p-1.5 rounded-md transition ${
              textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Align Right (دائیں جانب)"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            id="toolbar-align-justify"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAlign('justify')}
            className={`p-1.5 rounded-md transition ${
              textAlign === 'justify' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            title="Justify (برابر پھیلاؤ)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Text Direction RTL / LTR Toggle */}
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-0.5 shrink-0">
          <button
            id="toolbar-dir-rtl"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setDirection('rtl')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
              direction === 'rtl' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="Right-to-Left (Urdu) / دائیں سے بائیں"
          >
            RTL (اردو)
          </button>
          <button
            id="toolbar-dir-ltr"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setDirection('ltr')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
              direction === 'ltr' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="Left-to-Right (English) / بائیں سے دائیں"
          >
            LTR
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-0.5 shrink-0">
          <button
            id="toolbar-list-bullet"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleList('unordered')}
            className="p-1.5 rounded-md text-gray-700 hover:bg-gray-200 transition"
            title="Bullet List / نقطہ والی فہرست"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            id="toolbar-list-ordered"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleList('ordered')}
            className="p-1.5 rounded-md text-gray-700 hover:bg-gray-200 transition"
            title="Numbered List / نمبر وار فہرست"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Line Spacing */}
        <div className="relative shrink-0">
          <select
            id="toolbar-line-height"
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pr-6 appearance-none"
            title="Line Spacing / سطروں میں فاصلہ"
          >
            <option value="1.0">Line: 1.0</option>
            <option value="1.2">Line: 1.2</option>
            <option value="1.5">Line: 1.5</option>
            <option value="1.8">Line: 1.8</option>
            <option value="2.0">Line: 2.0</option>
            <option value="2.2">Line: 2.2 (Urdu)</option>
            <option value="2.5">Line: 2.5</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Word Spacing / الفاظ میں فاصلہ */}
        <div className="relative shrink-0">
          <select
            id="toolbar-word-spacing"
            value={wordSpacing}
            onChange={(e) => {
              setWordSpacing(e.target.value);
              setTimeout(recalculatePagination, 50);
            }}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pr-6 appearance-none"
            title="Word Spacing (الفاظ میں فاصلہ)"
          >
            <option value="normal">Word: Normal</option>
            <option value="2px">Word: 2px</option>
            <option value="4px">Word: 4px</option>
            <option value="6px">Word: 6px</option>
            <option value="8px">Word: 8px</option>
            <option value="12px">Word: 12px</option>
            <option value="16px">Word: 16px</option>
            <option value="-2px">Word: -2px (تنگ)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-gray-200 shrink-0" />

        {/* ==================================================== */}
        {/* 1. FRAME / BORDER SETTINGS BUTTON                    */}
        {/* ==================================================== */}
        <button
          id="toolbar-btn-border-settings"
          onClick={() => setIsBorderModalOpen(true)}
          className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium transition shrink-0 ${
            hasBorder
              ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs font-semibold'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
          }`}
          title="Page Frame / بارڈر سیٹنگز"
        >
          <Square className="w-3.5 h-3.5 text-blue-600" />
          <span>Frame: {hasBorder ? 'On' : 'Off'}</span>
        </button>

        {/* ==================================================== */}
        {/* 2. LIVE WORDS & STATS BUTTON                         */}
        {/* ==================================================== */}
        <button
          id="toolbar-word-count-toggle"
          onClick={() => setIsWordCountOpen(true)}
          className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 shrink-0"
          title="Live Words & Document Stats"
        >
          <span className="font-semibold text-blue-700">Words: {wordCount}</span>
        </button>

        {/* ==================================================== */}
        {/* 3. SHEET SIZE BUTTON                                 */}
        {/* ==================================================== */}
        <button
          id="toolbar-page-size"
          onClick={() => setIsPageSizeOpen(true)}
          className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shrink-0"
          title="Change Sheet Dimensions"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">{pageSize}</span>
        </button>

          {/* Manual Add Page Button */}
          <button
            id="toolbar-btn-page-break"
            onClick={handleAddPage}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition shrink-0 shadow-2xs cursor-pointer"
            title="Add New Page (نیا صفحہ شامل کریں)"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Page</span>
          </button>

          {/* Delete Page Button (when multi-page) */}
          {pagesCount > 1 && (
            <button
              id="toolbar-btn-delete-page"
              onClick={() => handleDeletePage()}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition shrink-0 shadow-2xs cursor-pointer"
              title="Delete Last Page (صفحہ حذف کریں)"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Delete Page</span>
            </button>
          )}

        {/* Utilities: Insert Image, Undo, Redo, Urdu Keyboard */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            id="toolbar-btn-image"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-200 text-gray-700 transition"
            title="Insert Image (تصویر شامل کریں)"
          >
            <ImageIcon className="w-4 h-4 text-blue-600" />
          </button>

          <button
            id="toolbar-btn-undo"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-200 text-gray-700 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            id="toolbar-btn-redo"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-200 text-gray-700 transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <button
            id="toolbar-btn-urdu-keyboard"
            onClick={() => setIsUrduKeyboardOpen(!isUrduKeyboardOpen)}
            className={`p-1.5 rounded-lg border transition ${
              isUrduKeyboardOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-200 text-gray-700'
            }`}
            title="Toggle Virtual Urdu Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

      {/* ==================================================== */}
      {/* 3. INTERACTIVE FLOATING IMAGE CONTROLLER             */}
      {/* ==================================================== */}
      {selectedImage && (
        <div
          id="image-inspector-panel"
          className="bg-white/95 backdrop-blur-md border border-blue-400 shadow-2xl rounded-2xl px-4 py-3 mx-4 my-2 sticky top-[108px] z-40 flex flex-wrap items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200 font-bold text-gray-900">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Image Settings (تصویر کی پوزیشن و سائز)</span>
          </div>

          {/* Position / Alignment Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-gray-500 px-1">Position:</span>
            <button
              onClick={() => {
                setImageAlignment('left');
                applyImageStyles(imageWidthPercent, 'left', imageRounded, imageShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                imageAlignment === 'left' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Align Left"
            >
              Left
            </button>
            <button
              onClick={() => {
                setImageAlignment('center');
                applyImageStyles(imageWidthPercent, 'center', imageRounded, imageShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                imageAlignment === 'center' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Align Center"
            >
              Center
            </button>
            <button
              onClick={() => {
                setImageAlignment('right');
                applyImageStyles(imageWidthPercent, 'right', imageRounded, imageShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                imageAlignment === 'right' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Align Right"
            >
              Right
            </button>
            <button
              onClick={() => {
                setImageAlignment('float-left');
                applyImageStyles(imageWidthPercent, 'float-left', imageRounded, imageShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                imageAlignment === 'float-left' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Float Left (Text wraps around)"
            >
              Float Left
            </button>
            <button
              onClick={() => {
                setImageAlignment('float-right');
                applyImageStyles(imageWidthPercent, 'float-right', imageRounded, imageShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                imageAlignment === 'float-right' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Float Right (Text wraps around)"
            >
              Float Right
            </button>
          </div>

          {/* Size Slider & Quick Presets */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 px-2.5 rounded-xl">
            <span className="text-[11px] font-semibold text-gray-500">Size:</span>
            <input
              type="range"
              min={15}
              max={100}
              value={imageWidthPercent}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setImageWidthPercent(val);
                applyImageStyles(val, imageAlignment, imageRounded, imageShadow, imageBorder);
              }}
              className="w-24 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-mono font-bold text-blue-700 min-w-[32px] text-right">
              {imageWidthPercent}%
            </span>

            {/* Quick Size Presets */}
            <div className="flex items-center gap-1 ml-1 border-l border-gray-300 pl-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setImageWidthPercent(pct);
                    applyImageStyles(pct, imageAlignment, imageRounded, imageShadow, imageBorder);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition ${
                    imageWidthPercent === pct ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Styling: Rounded & Shadow */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const nextRounded = imageRounded === 'none' ? 'md' : imageRounded === 'md' ? 'full' : 'none';
                setImageRounded(nextRounded);
                applyImageStyles(imageWidthPercent, imageAlignment, nextRounded, imageShadow, imageBorder);
              }}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-[11px] font-medium text-gray-700 transition"
              title="Toggle Rounded Corners"
            >
              Corners: {imageRounded}
            </button>

            <button
              onClick={() => {
                const nextShadow = !imageShadow;
                setImageShadow(nextShadow);
                applyImageStyles(imageWidthPercent, imageAlignment, imageRounded, nextShadow, imageBorder);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                imageShadow ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle Shadow"
            >
              Shadow: {imageShadow ? 'On' : 'Off'}
            </button>

            {/* Delete Image */}
            <button
              onClick={handleDeleteSelectedImage}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition border border-red-200 ml-1"
              title="Delete Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            {/* Close Inspector */}
            <button
              onClick={() => {
                if (selectedImage) selectedImage.style.outline = 'none';
                setSelectedImage(null);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Deselect"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. MULTI-PAGE CANVAS CONTAINER                       */}
      {/* ==================================================== */}
      <main
        ref={workspaceScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 flex flex-col items-center bg-[#1e293b] relative"
      >
        {/* Floating Page Status & Zoom Controls with Quick Add Page */}
        <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2.5 bg-gray-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl border border-gray-700 no-print text-xs">
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-700 font-medium">
            <span className="text-gray-400">Page</span>
            <span className="text-blue-400 font-bold">{activePageIndex}</span>
            <span className="text-gray-400">of</span>
            <span className="text-white font-bold">{pagesCount}</span>
          </div>

          <button
            id="floating-btn-add-page"
            onClick={handleAddPage}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-full font-semibold text-[11px] transition shadow-xs cursor-pointer active:scale-95"
            title="Add New Page (نیا صفحہ شامل کریں)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Page</span>
          </button>

          {pagesCount > 1 && (
            <button
              id="floating-btn-delete-page"
              onClick={() => handleDeletePage()}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600/80 hover:bg-red-600 active:bg-red-700 rounded-full font-semibold text-[11px] transition shadow-xs cursor-pointer active:scale-95"
              title="Delete Page (صفحہ حذف کریں)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <div className="flex items-center gap-1 pl-1 border-l border-gray-700">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1 hover:bg-gray-800 rounded-full transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1 font-semibold min-w-[32px] text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-1 hover:bg-gray-800 rounded-full transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Page Canvas Frame Wrapper */}
        <div
          className="transition-transform duration-150 origin-top flex flex-col items-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <div
            ref={documentContainerRef}
            id="printable-document-container"
            className="relative"
            style={{ width: `${activeSheetDim.width}px` }}
          >
            {/* Visual Multi-Page Background Sheets */}
            {Array.from({ length: pagesCount }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <div
                  key={`page-bg-${pageNumber}`}
                  id={`page-sheet-${pageNumber}`}
                  className="msword-page-sheet w-full bg-white rounded-xs relative mb-10 overflow-hidden"
                  style={{
                    height: `${activeSheetDim.height}px`,
                    boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Inscribed Rectangle Border Frame around page margins */}
                  {hasBorder && (
                    <div
                      className="page-frame-boundary absolute pointer-events-none transition-all rounded-xs z-10"
                      style={{
                        top: `${borderInset}px`,
                        left: `${borderInset}px`,
                        right: `${borderInset}px`,
                        bottom: `${borderInset}px`,
                        borderWidth: borderType === 'double' ? `${borderThickness * 2}px` : `${borderThickness}px`,
                        borderColor: resolvedBorderColor(),
                        borderStyle: borderType === 'corners' ? 'solid' : borderType === 'royal' ? 'double' : borderType
                      }}
                    >
                      {/* Double Inscribed accent for Royal style */}
                      {borderType === 'royal' && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            top: '4px',
                            left: '4px',
                            right: '4px',
                            bottom: '4px',
                            border: `1px solid ${resolvedBorderColor()}`
                          }}
                        />
                      )}

                      {/* Corner Accents if selected */}
                      {borderType === 'corners' && (
                        <>
                          <div
                            className="absolute -top-1.5 -left-1.5 w-4 h-4"
                            style={{
                              borderTop: `4px solid ${resolvedBorderColor()}`,
                              borderLeft: `4px solid ${resolvedBorderColor()}`
                            }}
                          />
                          <div
                            className="absolute -top-1.5 -right-1.5 w-4 h-4"
                            style={{
                              borderTop: `4px solid ${resolvedBorderColor()}`,
                              borderRight: `4px solid ${resolvedBorderColor()}`
                            }}
                          />
                          <div
                            className="absolute -bottom-1.5 -left-1.5 w-4 h-4"
                            style={{
                              borderBottom: `4px solid ${resolvedBorderColor()}`,
                              borderLeft: `4px solid ${resolvedBorderColor()}`
                            }}
                          />
                          <div
                            className="absolute -bottom-1.5 -right-1.5 w-4 h-4"
                            style={{
                              borderBottom: `4px solid ${resolvedBorderColor()}`,
                              borderRight: `4px solid ${resolvedBorderColor()}`
                            }}
                          />
                        </>
                      )}

                      {/* Page Number positioned INSIDE the rectangle border frame at bottom */}
                      {showPageNumber && (
                        <div
                          className={`absolute left-0 right-0 flex justify-center items-center pointer-events-none select-none ${
                            pageNumberPosition === 'inside' ? 'bottom-3' : '-bottom-3'
                          }`}
                        >
                          <span
                            className="text-[11px] font-mono px-3.5 py-0.5 rounded-full font-semibold border shadow-2xs"
                            style={{
                              color: resolvedBorderColor(),
                              borderColor: resolvedBorderColor(),
                              backgroundColor: '#ffffff'
                            }}
                          >
                            {renderPageNumberString(pageNumber, pagesCount)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback Page Number when border is turned off or in footer */}
                  {(!hasBorder || pageNumberPosition === 'footer') && showPageNumber && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center pointer-events-none select-none z-10">
                      <span className="text-[11px] font-mono text-gray-500 bg-white/90 px-3 py-0.5 rounded-full border border-gray-200 shadow-2xs font-semibold">
                        {renderPageNumberString(pageNumber, pagesCount)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Continuous Overlay Editable Canvas */}
            <div
              className="absolute top-0 left-0 w-full z-20"
              style={{
                direction: direction,
                lineHeight: lineHeight,
                color: textColor
              }}
            >
              <div
                ref={editorRef}
                id="editor-content-editable"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={recalculatePagination}
                onKeyUp={() => {
                  checkActiveFormats();
                  recalculatePagination();
                }}
                onKeyDown={recalculatePagination}
                onPaste={() => setTimeout(recalculatePagination, 50)}
                onCut={() => setTimeout(recalculatePagination, 50)}
                onMouseUp={checkActiveFormats}
                placeholder="یہاں لکھنا شروع کیجیے... (Type here in Urdu or English)"
                className={`document-canvas-editable w-full focus:outline-none ${fontFamily}`}
                style={{
                  fontSize: `${fontSize}px`,
                  textAlign: textAlign,
                  lineHeight: lineHeight,
                  wordSpacing: wordSpacing,
                  color: textColor,
                  minHeight: `${activeSheetDim.height}px`,
                  paddingTop: `${hasBorder ? Math.max(62, borderInset + 40) : 48}px`,
                  paddingBottom: `${hasBorder ? Math.max(76, borderInset + 54) : 48}px`,
                  paddingLeft: `${hasBorder ? Math.max(52, borderInset + 32) : 48}px`,
                  paddingRight: `${hasBorder ? Math.max(52, borderInset + 32) : 48}px`
                }}
              />
            </div>
          </div>

          {/* ==================================================== */}
          {/* Bottom "Add Page" and "Delete Page" Action Buttons  */}
          {/* ==================================================== */}
          <div className="mt-4 mb-24 flex flex-col items-center gap-2 no-print">
            <div className="flex items-center gap-3">
              <button
                id="btn-add-new-page-bottom"
                onClick={handleAddPage}
                className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full border border-white/25 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer font-semibold text-xs sm:text-sm tracking-wide"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-xs transition">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Add Page (نیا صفحہ)</span>
              </button>

              {pagesCount > 1 && (
                <button
                  id="btn-delete-page-bottom"
                  onClick={() => handleDeletePage()}
                  className="group flex items-center gap-2.5 px-5 py-3 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-200 rounded-full border border-red-400/30 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer font-semibold text-xs sm:text-sm tracking-wide"
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center text-white shadow-xs transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Delete Page (صفحہ حذف کریں)</span>
                </button>
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-sans tracking-wide">
              Manage your document sheets easily
            </span>
          </div>
        </div>
      </main>

      {/* ==================================================== */}
      {/* 5. MODAL: FRAME / BORDER SETTINGS DIALOG (NEVER CLIPS)*/}
      {/* ==================================================== */}
      {isBorderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Page Frame (بارڈر سیٹنگز)</h3>
              </div>
              <button
                onClick={() => setIsBorderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <div>
                <span className="font-bold text-gray-900 text-sm">Apply Frame to Pages</span>
                <p className="text-[11px] text-gray-500">صفحات کے گرد بارڈر اور فریم لگائیں</p>
              </div>
              <button
                id="toggle-frame-active"
                onClick={() => {
                  const newState = !hasBorder;
                  setHasBorder(newState);
                  onShowToast({
                    type: 'info',
                    title: newState ? 'Page Frame Enabled' : 'Page Frame Disabled',
                    description: newState ? 'Border applied to document sheets.' : 'Removed borders.'
                  });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                  hasBorder ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    hasBorder ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasBorder && (
              <>
                {/* Border Style (Solid, Double, Dashed, Dotted, Corners, Royal) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Border Style (سٹائل کا انتخاب)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'solid', label: 'Solid Line' },
                      { id: 'double', label: 'Double Line' },
                      { id: 'dashed', label: 'Dashed' },
                      { id: 'dotted', label: 'Dotted' },
                      { id: 'corners', label: 'Corners Frame' },
                      { id: 'royal', label: 'Royal Gold' }
                    ] as const).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setBorderType(style.id)}
                        className={`py-2 px-2.5 rounded-xl text-center font-medium border text-xs transition ${
                          borderType === style.id
                            ? 'bg-blue-50 text-blue-800 border-blue-500 font-bold shadow-2xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Tone / Color (Dark, Light, Gold, Blue, Green, Red) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Border Color Tone (رنگ و ٹون)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setBorderColorTone('dark')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'dark'
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white shrink-0" />
                      Dark
                    </button>
                    <button
                      onClick={() => setBorderColorTone('light')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'light'
                          ? 'bg-gray-300 text-gray-900 border-gray-400 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-gray-400 shrink-0" />
                      Light
                    </button>
                    <button
                      onClick={() => setBorderColorTone('gold')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'gold'
                          ? 'bg-amber-700 text-white border-amber-700 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                      Gold
                    </button>
                    <button
                      onClick={() => setBorderColorTone('primary')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'primary'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                      Blue
                    </button>
                    <button
                      onClick={() => setBorderColorTone('emerald')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'emerald'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      Green
                    </button>
                    <button
                      onClick={() => setBorderColorTone('crimson')}
                      className={`py-1.5 px-2 rounded-xl text-center font-medium border text-xs flex items-center justify-center gap-1.5 ${
                        borderColorTone === 'crimson'
                          ? 'bg-red-600 text-white border-red-600 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                      Red
                    </button>
                  </div>
                </div>

                {/* Border Thickness & Inset Margins */}
                <div className="space-y-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Border Thickness (موٹائی)</span>
                      <span className="font-mono text-blue-600 font-bold">{borderThickness}px</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={borderThickness}
                      onChange={(e) => setBorderThickness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Frame Margin / Inset (فاصلہ)</span>
                      <span className="font-mono text-blue-600">{borderInset}px</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={40}
                      value={borderInset}
                      onChange={(e) => setBorderInset(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Page Numbering in Rectangle Option */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Page Number (صفحہ نمبر دکھائیں)
                    </span>
                    <button
                      onClick={() => setShowPageNumber(!showPageNumber)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                        showPageNumber ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {showPageNumber ? 'Visible (آن)' : 'Hidden (بند)'}
                    </button>
                  </div>

                  {showPageNumber && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPageNumberPosition('inside')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                            pageNumberPosition === 'inside'
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          Inside Frame (فریم کے اندر)
                        </button>
                        <button
                          onClick={() => setPageNumberPosition('footer')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                            pageNumberPosition === 'footer'
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          Page Footer (صفحہ کے نیچے)
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(['urdu', 'english', 'simple'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setPageNumberFormat(fmt)}
                            className={`flex-1 py-1.5 rounded-lg text-xs capitalize border ${
                              pageNumberFormat === fmt
                                ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            {fmt === 'urdu' ? 'اردو (صفحہ ۱)' : fmt === 'english' ? 'English (Page 1)' : 'Simple (1 / 1)'}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsBorderModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                Done / ٹھیک ہے
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. MODAL: LIVE WORDS & DOCUMENT STATS                */}
      {/* ==================================================== */}
      {isWordCountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-3 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 font-bold text-gray-900 text-base">
              <span>Document Statistics (الفاظ و حروف)</span>
              <button
                onClick={() => setIsWordCountOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Pages (کل صفحات):</span>
                <span className="font-bold text-blue-600 text-base">{pagesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Words (کل الفاظ):</span>
                <span className="font-bold text-gray-900 text-base">{wordCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Characters with spaces (حروف):</span>
                <span className="font-semibold text-gray-800">{charCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Characters without spaces:</span>
                <span className="font-semibold text-gray-800">{charNoSpacesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paragraphs (پیراگراف):</span>
                <span className="font-semibold text-gray-800">{paragraphsCount}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <span>Estimated Reading Time:</span>
              <span className="font-bold text-gray-800">~{Math.max(1, Math.ceil(wordCount / 180))} min</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsWordCountOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
              >
                Close / بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. MODAL: SHEET SIZES & CUSTOM DIMENSIONS            */}
      {/* ==================================================== */}
      {isPageSizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-3.5 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Choose Sheet Size (کاغذ کا سائز)</h3>
              </div>
              <button
                onClick={() => setIsPageSizeOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['A4', 'Letter', 'Legal', 'A5'] as PageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    pageSize === size
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-gray-900">{size}</p>
                    <p className="text-[11px] font-normal text-gray-500 mt-0.5">{PAGE_SIZE_CONFIGS[size].label}</p>
                  </div>
                  {pageSize === size && (
                    <div className="mt-2 text-blue-600 flex items-center gap-1 text-[11px] font-semibold">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Dimensions Form */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 mt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-xs">Custom Canvas Size (اپنی مرضی کا سائز)</span>
                <div className="flex bg-white rounded-lg border border-gray-300 p-0.5 text-xs">
                  {(['mm', 'px', 'in'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setCustomUnit(u)}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        customUnit === u ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold block mb-1">Width ({customUnit})</label>
                  <input
                    type="number"
                    value={customWidthInput}
                    onChange={(e) => setCustomWidthInput(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 font-semibold block mb-1">Height ({customUnit})</label>
                  <input
                    type="number"
                    value={customHeightInput}
                    onChange={(e) => setCustomHeightInput(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleApplyCustomDimensions}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                Apply Custom Size (لاگو کریں)
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPageSizeOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. MODAL: TEXT COLOR PICKER                          */}
      {/* ==================================================== */}
      {isColorPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-5 space-y-3.5 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-900 text-base">
              <span>Text Color (فونٹ کا رنگ)</span>
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Preset Shades */}
            <div className="grid grid-cols-5 gap-2.5">
              {colorPalette.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleColorChange(c.hex)}
                  title={c.label}
                  className="w-10 h-10 rounded-xl border border-gray-300 hover:scale-110 transition shadow-2xs flex items-center justify-center relative"
                  style={{ backgroundColor: c.hex }}
                >
                  {textColor.toLowerCase() === c.hex.toLowerCase() && (
                    <Check className="w-4 h-4 text-white drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">Custom:</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 text-xs font-mono px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center uppercase"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 9. MODAL: DOWNLOAD / SAVE MENU                       */}
      {/* ==================================================== */}
      {isDownloadMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-3 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-900 text-base">
              <span>Download & Export (محفوظ کریں)</span>
              <button
                onClick={() => setIsDownloadMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                id="btn-download-pdf-direct"
                onClick={handleDirectPDFDownload}
                className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 flex items-center gap-3 transition font-semibold text-gray-800 border border-emerald-100 bg-emerald-50/40"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <p className="leading-tight text-sm font-bold text-emerald-900">Download PDF</p>
                  <p className="text-[11px] font-normal text-gray-500 mt-0.5">High quality multi-page PDF document</p>
                </div>
              </button>

              <button
                id="btn-download-image-gallery"
                onClick={handleDirectImageDownload}
                className="w-full text-left p-3 rounded-xl hover:bg-blue-50 hover:text-blue-950 flex items-center gap-3 transition font-semibold text-gray-800 border border-blue-100 bg-blue-50/40"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="leading-tight text-sm font-bold text-blue-900">Save to Gallery (PNG)</p>
                  <p className="text-[11px] font-normal text-gray-500 mt-0.5">High definition image for photo gallery</p>
                </div>
              </button>

              <button
                id="btn-print-dialog"
                onClick={handlePrint}
                className="w-full text-left p-3 rounded-xl hover:bg-gray-100 flex items-center gap-3 transition text-gray-700 border border-gray-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <p className="leading-tight text-sm font-bold">Print Dialogue</p>
                  <p className="text-[11px] font-normal text-gray-500 mt-0.5">Send directly to printer or system PDF</p>
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDownloadMenuOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 10. GALLERY SAVE PREVIEW MODAL                       */}
      {/* ==================================================== */}
      {galleryModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-base">Image Ready for Gallery</h3>
              </div>
              <button
                onClick={() => setGalleryModalImage(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 mb-3">
              Image downloaded to your files. You can also touch & hold (or right click) the preview below to save directly into your Photos/Gallery:
            </p>

            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-2 flex items-center justify-center border border-gray-200">
              <img
                src={galleryModalImage}
                alt="Exported Document"
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <a
                href={galleryModalImage}
                download={`${(title.trim() || 'Urdu-Document').replace(/[/\\?%*:|"<>]/g, '_')}.png`}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Save / Download Again</span>
              </a>
              <button
                onClick={() => setGalleryModalImage(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Virtual Urdu Keyboard */}
      <UrduKeyboard
        isOpen={isUrduKeyboardOpen}
        onClose={() => setIsUrduKeyboardOpen(false)}
        onInsertChar={handleInsertChar}
      />
    </div>
  );
};
