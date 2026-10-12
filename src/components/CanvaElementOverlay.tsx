import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  X,
  Lock,
  Unlock,
  MoveHorizontal,
  Palette,
  Check
} from 'lucide-react';

interface CanvaElementOverlayProps {
  selectedElement: HTMLElement | null;
  workspaceRef: React.RefObject<HTMLElement>;
  onDeselect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: () => void;
  lang?: 'urdu' | 'english';
}

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r';

const QUICK_COLORS = [
  { name: 'Deep Teal', hex: '#005461' },
  { name: 'Ocean Teal', hex: '#018790' },
  { name: 'Bright Turquoise', hex: '#00b7b5' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Dark Gray', hex: '#1e293b' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Emerald Green', hex: '#059669' }
];

export const CanvaElementOverlay: React.FC<CanvaElementOverlayProps> = ({
  selectedElement,
  workspaceRef,
  onDeselect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onUpdate,
  lang = 'urdu'
}) => {
  const isUrdu = lang === 'urdu';
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number; pct?: number } | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isThicknessMenuOpen, setIsThicknessMenuOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#005461');
  const [currentAlignment, setCurrentAlignment] = useState<'center' | 'left' | 'right'>('center');

  // Helper to find the inner line or SVG or element target (memoized by selectedElement)
  const innerInfo = useMemo(() => {
    if (!selectedElement) return null;
    // Check if selectedElement itself or child is a line
    const lineInner = selectedElement.querySelector('.doc-line-inner, [data-element-type="line"], hr') as HTMLElement | null;
    if (lineInner) return { type: 'line' as const, element: lineInner, container: selectedElement };

    // Check if hr
    if (selectedElement.tagName === 'HR') {
      return { type: 'line' as const, element: selectedElement, container: selectedElement };
    }

    // Check if it's an element container with a horizontal line style (height <= 20px and width > 50px)
    const innerDiv = selectedElement.querySelector('div') as HTMLElement | null;
    if (innerDiv && (innerDiv.style.borderBottom || (innerDiv.offsetHeight > 0 && innerDiv.offsetHeight <= 16))) {
      return { type: 'line' as const, element: innerDiv, container: selectedElement };
    }

    // Check if SVG
    const svgInner = selectedElement.tagName === 'SVG' ? (selectedElement as unknown as SVGElement) : selectedElement.querySelector('svg');
    if (svgInner) {
      return { type: 'svg' as const, element: svgInner as unknown as HTMLElement, container: selectedElement };
    }

    return { type: 'general' as const, element: selectedElement, container: selectedElement };
  }, [selectedElement]);

  const getInnerTarget = useCallback(() => innerInfo, [innerInfo]);
  const isLine = innerInfo?.type === 'line';

  // Measure bounding rectangle of selected element relative to the workspace container
  const updateRect = useCallback(() => {
    if (!selectedElement || !workspaceRef.current) {
      setRect(null);
      return;
    }

    // Measure the visible visual element (inner line or svg if available) for tighter accurate bounding box
    const target = innerInfo?.element || selectedElement;
    const elBounds = target.getBoundingClientRect();
    const containerBounds = workspaceRef.current.getBoundingClientRect();

    // If height is very small (like 2-3px line), expand bounding box slightly for easier clicking/handles
    const measuredHeight = Math.max(16, elBounds.height);
    const topOffset = elBounds.height < 16 ? (16 - elBounds.height) / 2 : 0;

    const newRect = {
      top: elBounds.top - containerBounds.top + workspaceRef.current.scrollTop - topOffset,
      left: elBounds.left - containerBounds.left + workspaceRef.current.scrollLeft,
      width: Math.max(40, elBounds.width),
      height: measuredHeight
    };

    const parentSheet = selectedElement.closest('.page-sheet, .msword-page-sheet') as HTMLElement;
    const maxWidth = parentSheet ? parentSheet.clientWidth - 96 : 700;
    const pct = Math.min(100, Math.max(10, Math.round((elBounds.width / maxWidth) * 100)));
    const newWidth = Math.round(elBounds.width);
    const newHeight = Math.round(elBounds.height);

    setRect((prev) => {
      if (
        prev &&
        Math.abs(prev.top - newRect.top) < 0.5 &&
        Math.abs(prev.left - newRect.left) < 0.5 &&
        Math.abs(prev.width - newRect.width) < 0.5 &&
        Math.abs(prev.height - newRect.height) < 0.5
      ) {
        return prev;
      }
      return newRect;
    });

    setLiveSize((prev) => {
      if (prev && prev.width === newWidth && prev.height === newHeight && prev.pct === pct) {
        return prev;
      }
      return {
        width: newWidth,
        height: newHeight,
        pct
      };
    });
  }, [selectedElement, workspaceRef, innerInfo]);

  // Keep overlay updated on scroll, window resize, and DOM changes
  useEffect(() => {
    updateRect();
    const workspaceEl = workspaceRef.current;
    if (!workspaceEl) return;

    const handleScroll = () => {
      if (!isResizing) updateRect();
    };

    workspaceEl.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateRect);

    const resizeObserver = new ResizeObserver(() => {
      if (!isResizing) updateRect();
    });
    if (selectedElement) {
      resizeObserver.observe(selectedElement);
      const inner = innerInfo?.element;
      if (inner && inner !== selectedElement) {
        resizeObserver.observe(inner);
      }
    }

    return () => {
      workspaceEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateRect);
      resizeObserver.disconnect();
    };
  }, [selectedElement, updateRect, isResizing, workspaceRef, innerInfo]);

  // Sync initial color & alignment
  useEffect(() => {
    if (!selectedElement || !innerInfo) return;
    const el = innerInfo.element;
    const bg = el.style.backgroundColor;
    const borderCol = el.style.borderColor || el.style.borderBottomColor;
    const svgColor = el.getAttribute('stroke') || el.getAttribute('fill') || (el as HTMLElement).style.color;
    if (bg && bg !== 'transparent') setCurrentColor(bg);
    else if (borderCol && borderCol !== 'transparent') setCurrentColor(borderCol);
    else if (svgColor) setCurrentColor(svgColor);

    const container = innerInfo.container || selectedElement;
    if (container.style.justifyContent === 'flex-start' || container.style.textAlign === 'left' || container.style.marginLeft === '0px') {
      setCurrentAlignment('left');
    } else if (container.style.justifyContent === 'flex-end' || container.style.textAlign === 'right' || container.style.marginRight === '0px') {
      setCurrentAlignment('right');
    } else {
      setCurrentAlignment('center');
    }
  }, [selectedElement, innerInfo]);

  // Drag-to-Resize Handler (specifically tuned for stretching lines & scaling SVGs)
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (!selectedElement || isLocked) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;

    const info = getInnerTarget();
    const target = info?.element || selectedElement;
    const initialBounds = target.getBoundingClientRect();
    const initialWidth = initialBounds.width;
    const initialHeight = Math.max(3, initialBounds.height);
    const aspectRatio = initialWidth / (initialHeight || 1);

    const parentSheet = selectedElement.closest('.page-sheet, .msword-page-sheet') as HTMLElement;
    const maxWidth = parentSheet ? parentSheet.clientWidth - 48 : 800;

    target.style.transition = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = initialWidth;
      let newHeight = initialHeight;

      if (info?.type === 'line') {
        // FOR LINES: Left/Right handles lengthen or shorten the line
        if (handle === 'r' || handle === 'br' || handle === 'tr') {
          if (currentAlignment === 'left') {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX));
          } else if (currentAlignment === 'right') {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX));
          } else {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX * 2));
          }
        } else if (handle === 'l' || handle === 'bl' || handle === 'tl') {
          if (currentAlignment === 'left') {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX));
          } else if (currentAlignment === 'right') {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX));
          } else {
            newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX * 2));
          }
        }

        // Top/Bottom handles adjust line thickness
        if (handle === 'b' || handle === 't') {
          const thicknessChange = handle === 'b' ? deltaY : -deltaY;
          newHeight = Math.max(1, Math.min(24, Math.round(initialHeight + thicknessChange)));
        }

        // Apply width and maxWidth to line
        if (newWidth >= maxWidth - 8) {
          target.style.width = '100%';
          target.style.maxWidth = '100%';
        } else {
          target.style.width = `${Math.round(newWidth)}px`;
          target.style.maxWidth = '100%';
        }
        if (info.container) {
          info.container.style.width = '100%';
        }

        if (handle === 'b' || handle === 't') {
          if (target.style.borderBottom) {
            const currentBorder = target.style.borderBottom;
            const parts = currentBorder.split(' ');
            const style = parts[1] || 'solid';
            const color = parts.slice(2).join(' ') || currentColor;
            target.style.borderBottom = `${newHeight}px ${style} ${color}`;
          } else if (target.style.height) {
            target.style.height = `${newHeight}px`;
          }
        }
      } else {
        // FOR SHAPES & SVGS: Proportional or dimensional scaling
        if (handle === 'br') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX));
          newHeight = Math.round(newWidth / aspectRatio);
        } else if (handle === 'bl') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX));
          newHeight = Math.round(newWidth / aspectRatio);
        } else if (handle === 'tr') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX));
          newHeight = Math.round(newWidth / aspectRatio);
        } else if (handle === 'tl') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX));
          newHeight = Math.round(newWidth / aspectRatio);
        } else if (handle === 'r') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth + deltaX));
        } else if (handle === 'l') {
          newWidth = Math.max(30, Math.min(maxWidth, initialWidth - deltaX));
        } else if (handle === 'b') {
          newHeight = Math.max(20, initialHeight + deltaY);
        } else if (handle === 't') {
          newHeight = Math.max(20, initialHeight - deltaY);
        }

        target.style.width = `${Math.round(newWidth)}px`;
        target.style.height = `${Math.round(newHeight)}px`;
        target.style.maxWidth = '100%';

        if (target.tagName === 'svg' || target.tagName === 'SVG') {
          target.setAttribute('width', `${Math.round(newWidth)}`);
          target.setAttribute('height', `${Math.round(newHeight)}`);
        }
      }

      const pct = Math.round((newWidth / maxWidth) * 100);
      setLiveSize({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
        pct: Math.min(100, Math.max(10, pct))
      });

      updateRect();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      target.style.transition = 'width 0.15s ease';
      setIsResizing(false);
      updateRect();
      onUpdate();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Preset widths (e.g. 25%, 50%, 75%, 100% full width across page)
  const applyPresetWidth = (pct: number) => {
    if (!selectedElement) return;
    const info = getInnerTarget();
    const target = info?.element || selectedElement;

    if (pct === 100) {
      target.style.width = '100%';
      target.style.maxWidth = '100%';
    } else {
      target.style.width = `${pct}%`;
      target.style.maxWidth = `${pct}%`;
    }

    if (info?.type === 'svg') {
      const parentSheet = selectedElement.closest('.page-sheet, .msword-page-sheet') as HTMLElement;
      const maxWidth = parentSheet ? parentSheet.clientWidth - 48 : 800;
      const pxWidth = Math.round((maxWidth * pct) / 100);
      target.style.width = `${pxWidth}px`;
      target.style.height = 'auto';
      if (target.tagName === 'svg' || target.tagName === 'SVG') {
        target.setAttribute('width', `${pxWidth}`);
      }
    }

    updateRect();
    onUpdate();
  };

  // Step Length/Width Change (لمبا کریں یا چھوٹا کریں)
  const handleStepLength = (deltaPct: number) => {
    if (!selectedElement) return;
    const info = getInnerTarget();
    const target = info?.element || selectedElement;

    const parentSheet = selectedElement.closest('.page-sheet, .msword-page-sheet') as HTMLElement;
    const maxWidth = parentSheet ? parentSheet.clientWidth - 48 : 800;
    const currentW = target.getBoundingClientRect().width || 400;
    const currentPct = Math.round((currentW / maxWidth) * 100);

    const newPct = Math.max(10, Math.min(100, currentPct + deltaPct));
    applyPresetWidth(newPct);
  };

  // Adjust Line Thickness (لکیر کی موٹائی)
  const handleLineThickness = (thicknessPx: number) => {
    if (!selectedElement) return;
    const info = getInnerTarget();
    const target = info?.element || selectedElement;

    if (target.style.borderBottom) {
      const current = target.style.borderBottom;
      const parts = current.split(' ');
      const style = parts[1] || 'solid';
      const col = parts.slice(2).join(' ') || currentColor;
      target.style.borderBottom = `${thicknessPx}px ${style} ${col}`;
    } else {
      target.style.height = `${thicknessPx}px`;
    }

    setIsThicknessMenuOpen(false);
    updateRect();
    onUpdate();
  };

  // Change Line Style (سیدھی، کٹی ہوئی، نقطہ دار، دوہری)
  const handleLineStyle = (style: 'solid' | 'dashed' | 'dotted' | 'double') => {
    if (!selectedElement) return;
    const info = getInnerTarget();
    const target = info?.element || selectedElement;

    if (style === 'solid') {
      target.style.borderBottom = 'none';
      target.style.backgroundColor = currentColor;
      target.style.height = '3px';
      target.style.borderRadius = '2px';
    } else if (style === 'dashed') {
      target.style.backgroundColor = 'transparent';
      target.style.height = '0px';
      target.style.borderBottom = `2.5px dashed ${currentColor}`;
    } else if (style === 'dotted') {
      target.style.backgroundColor = 'transparent';
      target.style.height = '0px';
      target.style.borderBottom = `3px dotted ${currentColor}`;
    } else if (style === 'double') {
      target.style.backgroundColor = 'transparent';
      target.style.height = '0px';
      target.style.borderBottom = `4px double ${currentColor}`;
    }

    updateRect();
    onUpdate();
  };

  // Change Element Color
  const handleColorChange = (hex: string) => {
    if (!selectedElement) return;
    setCurrentColor(hex);
    const info = getInnerTarget();
    const target = info?.element || selectedElement;

    if (info?.type === 'line') {
      if (target.style.borderBottom && target.style.borderBottom !== 'none') {
        const parts = target.style.borderBottom.split(' ');
        const width = parts[0] || '2.5px';
        const style = parts[1] || 'dashed';
        target.style.borderBottom = `${width} ${style} ${hex}`;
      } else {
        target.style.backgroundColor = hex;
      }
    } else {
      // SVGs or shape elements
      const svgs = selectedElement.querySelectorAll('svg, path, rect, circle, polygon');
      svgs.forEach((item) => {
        if (item.hasAttribute('stroke') && item.getAttribute('stroke') !== 'none') {
          item.setAttribute('stroke', hex);
        }
        if (item.hasAttribute('fill') && item.getAttribute('fill') !== 'none') {
          item.setAttribute('fill', hex);
        }
      });
      target.style.color = hex;
    }

    setIsColorPickerOpen(false);
    updateRect();
    onUpdate();
  };

  // Alignment: Left, Center, Right (بائیں، درمیان، دائیں)
  const setAlignment = (align: 'center' | 'left' | 'right') => {
    if (!selectedElement) return;
    setCurrentAlignment(align);
    const container = selectedElement.closest('.doc-element-block') as HTMLElement || selectedElement;

    container.style.display = 'flex';
    if (align === 'center') {
      container.style.justifyContent = 'center';
      container.style.textAlign = 'center';
      container.style.marginLeft = 'auto';
      container.style.marginRight = 'auto';
    } else if (align === 'left') {
      container.style.justifyContent = 'flex-start';
      container.style.textAlign = 'left';
      container.style.marginLeft = '0';
      container.style.marginRight = 'auto';
    } else if (align === 'right') {
      container.style.justifyContent = 'flex-end';
      container.style.textAlign = 'right';
      container.style.marginLeft = 'auto';
      container.style.marginRight = '0';
    }

    updateRect();
    onUpdate();
  };

  if (!selectedElement || !rect) return null;

  return (
    <div
      id="canva-element-selection-overlay"
      className="absolute pointer-events-none z-30 select-none no-print"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* CANVA TEAL SELECTION BOUNDING BOX                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute inset-0 border-2 border-[#00b7b5] pointer-events-none rounded-xs shadow-md ring-2 ring-[#005461]/20" />

      {/* ----------------------------------------------------------------- */}
      {/* LIVE DIMENSION PILL (Shows real-time length, width, and %)        */}
      {/* ----------------------------------------------------------------- */}
      {(isResizing || liveSize) && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-9 px-3 py-1 bg-[#005461]/95 text-white font-mono text-[11px] font-semibold rounded-md shadow-xl backdrop-blur-xs border border-[#00b7b5]/50 pointer-events-none flex items-center gap-2 transition-opacity duration-150 ${
            isResizing ? 'opacity-100 scale-105' : 'opacity-85'
          }`}
        >
          <span className="text-[#00b7b5] font-bold">
            {isLine ? (isUrdu ? 'لمبائی:' : 'Length:') : (isUrdu ? 'چوڑائی:' : 'Width:')}
          </span>
          <span>{liveSize?.width.toLocaleString()}px</span>
          {liveSize?.pct && <span className="text-teal-300">({liveSize.pct}%)</span>}
          {!isLine && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-[#00b7b5]">{isUrdu ? 'اونچائی:' : 'Height:'}</span>
              <span>{liveSize?.height.toLocaleString()}px</span>
            </>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* CORNER & EDGE RESIZE HANDLES                                      */}
      {/* ----------------------------------------------------------------- */}
      {!isLocked && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tl')}
            className="pointer-events-auto absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nwse-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title={isUrdu ? 'لمبائی یا سائز بدلیں' : 'Resize / Adjust length'}
          />

          {/* Top-Right */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tr')}
            className="pointer-events-auto absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title={isUrdu ? 'لمبائی یا سائز بدلیں' : 'Resize / Adjust length'}
          />

          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'bl')}
            className="pointer-events-auto absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title={isUrdu ? 'لمبائی یا سائز بدلیں' : 'Resize / Adjust length'}
          />

          {/* Bottom-Right (Primary prominent handle) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'br')}
            className="pointer-events-auto absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-[#005461] border-2 border-white rounded-full cursor-nwse-resize shadow-md ring-2 ring-[#00b7b5]/50 hover:scale-135 active:scale-135 transition-transform"
            title={isUrdu ? 'پکڑ کر کھینچیں اور لمبا یا بڑا کریں' : 'Drag to stretch length or resize'}
          />

          {/* Left Edge Handle (Prominent for stretching line from left) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'l')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -left-2 w-3.5 h-6 bg-white border-2 border-[#005461] rounded-full cursor-ew-resize shadow-md hover:scale-125 active:scale-125 hover:bg-[#00b7b5]/30 transition-transform flex items-center justify-center"
            title={isUrdu ? 'بائیں سے کھینچ کر لمبا کریں' : 'Drag left to lengthen'}
          >
            <div className="w-0.5 h-3 bg-[#005461]" />
          </div>

          {/* Right Edge Handle (Prominent for stretching line from right) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'r')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -right-2 w-3.5 h-6 bg-[#005461] border-2 border-white rounded-full cursor-ew-resize shadow-md hover:scale-125 active:scale-125 ring-2 ring-[#00b7b5]/40 transition-transform flex items-center justify-center"
            title={isUrdu ? 'دائیں سے کھینچ کر لمبا کریں' : 'Drag right to lengthen'}
          >
            <div className="w-0.5 h-3 bg-white" />
          </div>

          {/* Top Edge Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 't')}
            className="pointer-events-auto absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-[#005461] rounded-full cursor-ns-resize shadow-xs hover:scale-125 active:scale-125 transition-transform"
            title={isLine ? (isUrdu ? 'لکیر کی موٹائی بدلیں' : 'Change line thickness') : (isUrdu ? 'اونچائی بدلیں' : 'Change height')}
          />

          {/* Bottom Edge Handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'b')}
            className="pointer-events-auto absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-[#005461] rounded-full cursor-ns-resize shadow-xs hover:scale-125 active:scale-125 transition-transform"
            title={isLine ? (isUrdu ? 'لکیر کی موٹائی بدلیں' : 'Change line thickness') : (isUrdu ? 'اونچائی بدلیں' : 'Change height')}
          />
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* FLOATING ACTION TOOLBAR (Positioned underneath element)           */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-full mt-3 flex items-center gap-1.5 bg-white text-gray-800 px-3 py-2 rounded-2xl shadow-2xl border-2 border-[#005461] z-40 text-xs animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
      >
        {/* SPECIFIC CONTROLS FOR LINES */}
        {isLine ? (
          <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
            <button
              type="button"
              onClick={() => handleStepLength(15)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#005461] text-white hover:bg-[#018790] transition active:scale-95 flex items-center gap-1 shadow-xs"
              title={isUrdu ? 'لکیر کو لمبا کریں (+15%)' : 'Make Line Longer (+15%)'}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>{isUrdu ? '⟵ لمبا کریں (+15%) ⟶' : '⟵ Longer (+15%) ⟶'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepLength(-15)}
              className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95"
              title={isUrdu ? 'چھوٹا کریں (-15%)' : 'Make Shorter (-15%)'}
            >
              <span>{isUrdu ? '− چھوٹا' : '− Shorter'}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetWidth(100)}
              className="px-2 py-1 text-[11px] font-bold rounded-lg bg-teal-50 border border-teal-300 text-[#005461] hover:bg-teal-100 transition active:scale-95"
              title={isUrdu ? 'پورے صفحے پر لمبی لکیر (100%)' : '100% Full Page Width'}
            >
              <span>{isUrdu ? '100% فل صفحہ' : '100% Full Page'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
            <button
              type="button"
              onClick={() => handleStepLength(-10)}
              className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95"
              title={isUrdu ? 'چھوٹا کریں (-10%)' : 'Smaller (-10%)'}
            >
              <span>{isUrdu ? '− چھوٹا' : '− Smaller'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepLength(10)}
              className="px-2 py-1 text-[11px] font-bold rounded-lg bg-[#005461] text-white hover:bg-[#018790] transition text-gray-700 active:scale-95"
              title={isUrdu ? 'بڑا کریں (+10%)' : 'Bigger (+10%)'}
            >
              <span>{isUrdu ? '+ بڑا' : '+ Bigger'}</span>
            </button>
          </div>
        )}

        {/* Quick Size Presets (25%, 50%, 75%, 100%) */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#018790]/20">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyPresetWidth(pct)}
              className={`px-1.5 py-1 text-[10px] font-bold rounded hover:bg-[#00b7b5]/15 hover:text-[#005461] transition ${
                liveSize?.pct === pct ? 'bg-[#005461] text-white' : 'text-gray-600'
              }`}
              title={isUrdu ? `چوڑائی / طول ${pct}% کریں` : `Set width to ${pct}%`}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* MOVE UP & MOVE DOWN */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
          <button
            type="button"
            onClick={() => {
              onMoveUp();
              setTimeout(updateRect, 40);
              setTimeout(updateRect, 150);
            }}
            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] text-gray-700 transition flex items-center gap-1 active:scale-95"
            title={isUrdu ? 'اوپر لے جائیں' : 'Move Up'}
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#005461]" />
            <span>{isUrdu ? 'اوپر' : 'Up'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onMoveDown();
              setTimeout(updateRect, 40);
              setTimeout(updateRect, 150);
            }}
            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] text-gray-700 transition flex items-center gap-1 active:scale-95"
            title={isUrdu ? 'نیچے لے جائیں' : 'Move Down'}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#005461]" />
            <span>{isUrdu ? 'نیچے' : 'Down'}</span>
          </button>
        </div>

        {/* ALIGNMENT */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-1.5 rounded-lg transition ${
              currentAlignment === 'left'
                ? 'bg-[#005461] text-white'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 text-gray-700'
            }`}
            title={isUrdu ? 'بائیں جانب کریں' : 'Align Left'}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-1.5 rounded-lg transition ${
              currentAlignment === 'center'
                ? 'bg-[#005461] text-white'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 text-gray-700'
            }`}
            title={isUrdu ? 'درمیان میں رکھیں' : 'Align Center'}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`p-1.5 rounded-lg transition ${
              currentAlignment === 'right'
                ? 'bg-[#005461] text-white'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 text-gray-700'
            }`}
            title={isUrdu ? 'دائیں جانب کریں' : 'Align Right'}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* LINE STYLES & THICKNESS */}
        {isLine && (
          <div className="relative flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
            <button
              type="button"
              onClick={() => setIsThicknessMenuOpen(!isThicknessMenuOpen)}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-[#018790]/25 hover:bg-[#00b7b5]/15 text-gray-700 transition"
              title={isUrdu ? 'لکیر کی موٹائی اور انداز' : 'Line Thickness & Style'}
            >
              {isUrdu ? 'موٹائی / انداز' : 'Thickness & Style'}
            </button>

            {/* Thickness dropdown popup */}
            {isThicknessMenuOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-[#005461] rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-2 min-w-[170px] animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-bold text-gray-500">
                  {isUrdu ? 'لکیر کی موٹائی:' : 'Line Thickness:'}
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 4, 6].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleLineThickness(t)}
                      className="px-2 py-1 text-[11px] font-bold rounded border hover:bg-[#00b7b5]/15 text-[#005461]"
                    >
                      {t}px
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-500 mt-1">
                  {isUrdu ? 'لکیر کا انداز:' : 'Line Style:'}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleLineStyle('solid');
                      setIsThicknessMenuOpen(false);
                    }}
                    className="px-2 py-1 text-[11px] text-right rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{isUrdu ? 'سیدھی (Solid)' : 'Solid'}</span>
                    <span className="w-12 h-0.5 bg-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLineStyle('dashed');
                      setIsThicknessMenuOpen(false);
                    }}
                    className="px-2 py-1 text-[11px] text-right rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{isUrdu ? 'کٹی ہوئی (Dashed)' : 'Dashed'}</span>
                    <span className="w-12 border-b-2 border-dashed border-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLineStyle('dotted');
                      setIsThicknessMenuOpen(false);
                    }}
                    className="px-2 py-1 text-[11px] text-right rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{isUrdu ? 'نقطہ دار (Dotted)' : 'Dotted'}</span>
                    <span className="w-12 border-b-2 border-dotted border-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLineStyle('double');
                      setIsThicknessMenuOpen(false);
                    }}
                    className="px-2 py-1 text-[11px] text-right rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{isUrdu ? 'دوہری (Double)' : 'Double'}</span>
                    <span className="w-12 border-b-4 border-double border-gray-700" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COLOR PICKER */}
        <div className="relative flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
          <button
            type="button"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#018790]/25 hover:bg-[#00b7b5]/15 transition"
            title={isUrdu ? 'رنگ تبدیل کریں' : 'Change Color'}
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-[11px] font-semibold text-gray-700">
              {isUrdu ? 'رنگ' : 'Color'}
            </span>
          </button>

          {isColorPickerOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border-2 border-[#005461] rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-2 min-w-[190px] animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-bold text-gray-500">
                {isUrdu ? 'پسندیدہ رنگ منتخب کریں:' : 'Preset Colors:'}
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {QUICK_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleColorChange(col.hex)}
                    className="w-6 h-6 rounded-full border border-gray-300 shadow-xs hover:scale-115 transition relative flex items-center justify-center"
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {currentColor.toLowerCase() === col.hex.toLowerCase() && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <span className="text-[10px] text-gray-500">
                  {isUrdu ? 'کسٹم رنگ:' : 'Custom Color:'}
                </span>
                <input
                  type="color"
                  value={currentColor.startsWith('#') ? currentColor : '#005461'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-gray-300 p-0"
                  title={isUrdu ? 'کسٹم رنگ منتخب کریں' : 'Choose custom color'}
                />
              </div>
            </div>
          )}
        </div>

        {/* LOCK / UNLOCK */}
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`p-1.5 rounded-lg border transition ${
            isLocked
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-white border-[#018790]/25 hover:bg-gray-50 text-gray-600'
          }`}
          title={isUrdu ? (isLocked ? 'کھولیں' : 'لاک کریں') : (isLocked ? 'Unlock Element' : 'Lock Element')}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* DUPLICATE */}
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1.5 text-gray-600 hover:text-[#005461] bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 rounded-lg transition"
          title={isUrdu ? 'کاپی بنائیں' : 'Duplicate'}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* DELETE */}
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition"
          title={isUrdu ? 'حذف کریں' : 'Delete'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* CLOSE SELECTION */}
        <button
          type="button"
          onClick={onDeselect}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          title={isUrdu ? 'بند کریں' : 'Close'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
