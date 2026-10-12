import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Sparkles,
  X,
  RotateCw,
  Lock,
  Unlock
} from 'lucide-react';

interface CanvaImageOverlayProps {
  selectedImage: HTMLImageElement | null;
  workspaceRef: React.RefObject<HTMLElement>;
  onDeselect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onUpdate: () => void;
  lang?: 'urdu' | 'english';
}

type ResizeHandle =
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br'
  | 't'
  | 'b'
  | 'l'
  | 'r';

export const CanvaImageOverlay: React.FC<CanvaImageOverlayProps> = ({
  selectedImage,
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
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const [imageAlignment, setImageAlignment] = useState<'center' | 'left' | 'right'>('center');
  const [imageRounded, setImageRounded] = useState<'none' | 'md' | 'full'>('md');
  const [imageShadow, setImageShadow] = useState<boolean>(true);

  // Measure bounding rectangle of selected image relative to the workspace container
  const updateRect = useCallback(() => {
    if (!selectedImage || !workspaceRef.current) {
      setRect(null);
      return;
    }
    const imgBounds = selectedImage.getBoundingClientRect();
    const containerBounds = workspaceRef.current.getBoundingClientRect();

    const newRect = {
      top: imgBounds.top - containerBounds.top + workspaceRef.current.scrollTop,
      left: imgBounds.left - containerBounds.left + workspaceRef.current.scrollLeft,
      width: imgBounds.width,
      height: imgBounds.height
    };

    const newWidth = Math.round(imgBounds.width);
    const newHeight = Math.round(imgBounds.height);

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
      if (prev && prev.width === newWidth && prev.height === newHeight) {
        return prev;
      }
      return {
        width: newWidth,
        height: newHeight
      };
    });
  }, [selectedImage, workspaceRef]);

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
    if (selectedImage) {
      resizeObserver.observe(selectedImage);
    }

    return () => {
      workspaceEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateRect);
      resizeObserver.disconnect();
    };
  }, [selectedImage, updateRect, isResizing, workspaceRef]);

  // Sync current styling of image on select
  useEffect(() => {
    if (!selectedImage) return;
    const br = selectedImage.style.borderRadius;
    if (br === '9999px' || br === '50%') setImageRounded('full');
    else if (br === '0px' || br === 'none') setImageRounded('none');
    else setImageRounded('md');

    setImageShadow(selectedImage.style.boxShadow !== 'none');

    if (selectedImage.style.marginLeft === '0px' || selectedImage.style.marginLeft === '0') {
      setImageAlignment('left');
    } else if (selectedImage.style.marginRight === '0px' || selectedImage.style.marginRight === '0') {
      setImageAlignment('right');
    } else {
      setImageAlignment('center');
    }
  }, [selectedImage]);

  // Drag-to-Resize Handler
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (!selectedImage || isLocked) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = selectedImage.offsetWidth || selectedImage.getBoundingClientRect().width;
    const initialHeight = selectedImage.offsetHeight || selectedImage.getBoundingClientRect().height;
    const aspectRatio = initialWidth / (initialHeight || 1);

    // Parent sheet width for clamping
    const parentSheet = selectedImage.closest('.page-sheet') as HTMLElement;
    const maxWidth = parentSheet ? parentSheet.clientWidth - 48 : 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = initialWidth;
      let newHeight = initialHeight;

      if (handle === 'br') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth + deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'bl') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth - deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'tr') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth + deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'tl') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth - deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'r') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth + deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'l') {
        newWidth = Math.max(50, Math.min(maxWidth, initialWidth - deltaX));
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (handle === 'b') {
        newHeight = Math.max(40, initialHeight + deltaY);
        newWidth = Math.round(newHeight * aspectRatio);
      } else if (handle === 't') {
        newHeight = Math.max(40, initialHeight - deltaY);
        newWidth = Math.round(newHeight * aspectRatio);
      }

      // Apply directly to image element for buttery smooth 60fps rendering
      selectedImage.style.width = `${Math.round(newWidth)}px`;
      selectedImage.style.height = 'auto';
      selectedImage.style.maxWidth = '100%';

      setLiveSize({
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      });

      updateRect();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
      updateRect();
      onUpdate();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Preset sizes
  const applyPresetWidth = (pct: number) => {
    if (!selectedImage) return;
    selectedImage.style.width = `${pct}%`;
    selectedImage.style.height = 'auto';
    selectedImage.style.maxWidth = '100%';
    updateRect();
    onUpdate();
  };

  // Step size change (چھوٹا یا بڑا کریں)
  const handleStepSize = (deltaPct: number) => {
    if (!selectedImage) return;
    const currentW = selectedImage.style.width || '50%';
    let currentPct = 50;
    if (currentW.endsWith('%')) {
      currentPct = parseInt(currentW, 10) || 50;
    } else {
      const parentSheet = selectedImage.closest('.msword-page-sheet, .page-sheet') as HTMLElement;
      const maxWidth = parentSheet ? parentSheet.clientWidth - 96 : 700;
      currentPct = Math.round(((selectedImage.offsetWidth || 300) / maxWidth) * 100);
    }
    const newPct = Math.max(10, Math.min(100, currentPct + deltaPct));
    applyPresetWidth(newPct);
  };

  // Align image (بائیں، درمیان، یا دائیں جانب رکھیں)
  const setAlignment = (align: 'center' | 'left' | 'right') => {
    if (!selectedImage) return;
    setImageAlignment(align);
    selectedImage.style.display = 'block';
    selectedImage.style.float = 'none';

    if (align === 'center') {
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = 'auto';
      if (selectedImage.parentElement && (selectedImage.parentElement.tagName === 'P' || selectedImage.parentElement.tagName === 'DIV')) {
        selectedImage.parentElement.style.textAlign = 'center';
      }
    } else if (align === 'left') {
      selectedImage.style.marginLeft = '0';
      selectedImage.style.marginRight = 'auto';
      if (selectedImage.parentElement && (selectedImage.parentElement.tagName === 'P' || selectedImage.parentElement.tagName === 'DIV')) {
        selectedImage.parentElement.style.textAlign = 'left';
      }
    } else if (align === 'right') {
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = '0';
      if (selectedImage.parentElement && (selectedImage.parentElement.tagName === 'P' || selectedImage.parentElement.tagName === 'DIV')) {
        selectedImage.parentElement.style.textAlign = 'right';
      }
    }
    updateRect();
    onUpdate();
  };

  // Toggle corners
  const toggleCorners = () => {
    if (!selectedImage) return;
    const next = imageRounded === 'none' ? 'md' : imageRounded === 'md' ? 'full' : 'none';
    setImageRounded(next);
    if (next === 'none') selectedImage.style.borderRadius = '0px';
    else if (next === 'md') selectedImage.style.borderRadius = '12px';
    else if (next === 'full') selectedImage.style.borderRadius = '9999px';
    updateRect();
    onUpdate();
  };

  // Toggle shadow
  const toggleShadow = () => {
    if (!selectedImage) return;
    const next = !imageShadow;
    setImageShadow(next);
    selectedImage.style.boxShadow = next ? '0 8px 24px rgba(0,0,0,0.18)' : 'none';
    updateRect();
    onUpdate();
  };

  if (!selectedImage || !rect) return null;

  return (
    <div
      id="canva-image-selection-overlay"
      className="absolute pointer-events-none z-30 select-none no-print"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* CANVA TEAL-THEME BOUNDING BOX (2px solid #005461)                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute inset-0 border-2 border-[#005461] pointer-events-none rounded-xs shadow-xs" />

      {/* ----------------------------------------------------------------- */}
      {/* LIVE DIMENSION PILL - Visible when Resizing                        */}
      {/* ----------------------------------------------------------------- */}
      {(isResizing || liveSize) && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-9 px-2.5 py-1 bg-[#005461]/95 text-white font-mono text-[11px] font-semibold rounded-md shadow-xl backdrop-blur-xs border border-[#00b7b5]/50 pointer-events-none flex items-center gap-1.5 transition-opacity duration-150 ${
            isResizing ? 'opacity-100 scale-105' : 'opacity-85'
          }`}
        >
          <span className="text-[#00b7b5]">w:</span>
          <span>{liveSize?.width.toLocaleString()}px</span>
          <span className="text-gray-300">•</span>
          <span className="text-[#00b7b5]">h:</span>
          <span>{liveSize?.height.toLocaleString()}px</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 4 CORNER HANDLES (Teal-themed circular drag nodes)                */}
      {/* ----------------------------------------------------------------- */}
      {!isLocked && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tl')}
            className="pointer-events-auto absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nwse-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title="Resize / چھوٹا یا بڑا کریں"
          />

          {/* Top-Right */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tr')}
            className="pointer-events-auto absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title="Resize / چھوٹا یا بڑا کریں"
          />

          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'bl')}
            className="pointer-events-auto absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#005461] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#005461] transition-transform"
            title="Resize / چھوٹا یا بڑا کریں"
          />

          {/* Bottom-Right (Primary prominent drag handle) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'br')}
            className="pointer-events-auto absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-[#005461] border-2 border-white rounded-full cursor-nwse-resize shadow-md ring-2 ring-[#00b7b5]/50 hover:scale-135 active:scale-135 transition-transform"
            title="Drag to Resize Image (تصویر کھینچ کر چھوٹی یا بڑی کریں)"
          />

          {/* --------------------------------------------------------------- */}
          {/* 4 EDGE PILL HANDLES                                             */}
          {/* --------------------------------------------------------------- */}
          {/* Top Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 't')}
            className="pointer-events-auto absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white border border-[#005461] rounded-full cursor-ns-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-[#00b7b5]/20 transition-transform"
            title="Adjust Height"
          />

          {/* Bottom Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'b')}
            className="pointer-events-auto absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white border border-[#005461] rounded-full cursor-ns-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-[#00b7b5]/20 transition-transform"
            title="Adjust Height"
          />

          {/* Left Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'l')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -left-1 w-1.5 h-6 bg-white border border-[#005461] rounded-full cursor-ew-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-[#00b7b5]/20 transition-transform"
            title="Adjust Width"
          />

          {/* Right Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'r')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-6 bg-white border border-[#005461] rounded-full cursor-ew-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-[#00b7b5]/20 transition-transform"
            title="Adjust Width (چوڑائی بدلیں)"
          />
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* FLOATING ACTION BAR (Themed directly below image)                 */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-full mt-3 flex items-center gap-1.5 bg-white text-gray-800 px-3 py-2 rounded-2xl shadow-2xl border-2 border-[#005461] z-40 text-xs animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
      >
        {/* Resize Stepper [-] [+] */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
          <button
            type="button"
            onClick={() => handleStepSize(-10)}
            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95 flex items-center gap-0.5"
            title={isUrdu ? 'چھوٹا کریں (-10%)' : 'Decrease size (-10%)'}
          >
            <span>−</span>
            <span>{isUrdu ? 'چھوٹا' : 'Smaller'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleStepSize(10)}
            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-700 active:scale-95 flex items-center gap-0.5"
            title={isUrdu ? 'بڑا کریں (+10%)' : 'Increase size (+10%)'}
          >
            <span>+</span>
            <span>{isUrdu ? 'بڑا' : 'Bigger'}</span>
          </button>
        </div>

        {/* Quick Size Presets */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#018790]/20">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyPresetWidth(pct)}
              className="px-1.5 py-1 text-[10px] font-bold rounded hover:bg-[#00b7b5]/15 hover:text-[#005461] transition text-gray-600"
              title={isUrdu ? `${pct}% چوڑائی سیٹ کریں` : `Set width to ${pct}%`}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              imageAlignment === 'left'
                ? 'bg-[#005461] text-white shadow-xs'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] text-gray-700'
            }`}
            title={isUrdu ? 'بائیں جانب کریں' : 'Align Left'}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'بائیں' : 'Left'}</span>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              imageAlignment === 'center'
                ? 'bg-[#005461] text-white shadow-xs'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] text-gray-700'
            }`}
            title={isUrdu ? 'درمیان میں کریں' : 'Align Center'}
          >
            <AlignCenter className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'درمیان' : 'Center'}</span>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              imageAlignment === 'right'
                ? 'bg-[#005461] text-white shadow-xs'
                : 'bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 hover:text-[#005461] text-gray-700'
            }`}
            title={isUrdu ? 'دائیں جانب کریں' : 'Align Right'}
          >
            <AlignRight className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'دائیں' : 'Right'}</span>
          </button>
        </div>

        {/* Move Up & Move Down (اوپر اور نیچے منتقل کریں) */}
        {(onMoveUp || onMoveDown) && (
          <div className="flex items-center gap-1 pr-1.5 border-r border-[#018790]/20">
            {onMoveUp && (
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
            )}
            {onMoveDown && (
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
            )}
          </div>
        )}

        {/* Rounded Corners */}
        <button
          type="button"
          onClick={toggleCorners}
          className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition ${
            imageRounded !== 'none'
              ? 'bg-[#00b7b5]/15 text-[#005461] border-[#018790]'
              : 'bg-white border-[#018790]/25 hover:bg-gray-50 text-gray-600'
          }`}
          title={isUrdu ? 'گولائی تبدیل کریں' : 'Toggle Rounded Corners'}
        >
          {imageRounded === 'none'
            ? isUrdu ? 'سیدھا' : 'Square'
            : imageRounded === 'md'
            ? isUrdu ? 'گول' : 'Round'
            : isUrdu ? 'دائرہ' : 'Circle'}
        </button>

        {/* Shadow */}
        <button
          type="button"
          onClick={toggleShadow}
          className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition ${
            imageShadow
              ? 'bg-[#00b7b5]/15 text-[#005461] border-[#018790]'
              : 'bg-white border-[#018790]/25 hover:bg-gray-50 text-gray-600'
          }`}
          title={isUrdu ? 'سایہ آن یا آف کریں' : 'Toggle Shadow'}
        >
          {isUrdu ? 'سایہ' : 'Shadow'}
        </button>

        {/* Lock / Unlock */}
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`p-1.5 rounded-lg border transition ${
            isLocked ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white border-[#018790]/25 hover:bg-gray-50 text-gray-600'
          }`}
          title={isUrdu ? (isLocked ? 'کھولیں' : 'لاک کریں') : (isLocked ? 'Unlock Image' : 'Lock Image')}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1.5 text-gray-600 hover:text-[#005461] bg-white border border-[#018790]/25 hover:bg-[#00b7b5]/15 rounded-lg transition"
          title={isUrdu ? 'تصویر کی کاپی بنائیں' : 'Duplicate Image'}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition"
          title={isUrdu ? 'تصویر حذف کریں' : 'Delete Image'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Close Selection */}
        <button
          type="button"
          onClick={onDeselect}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          title={isUrdu ? 'بند کریں' : 'Deselect'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
