import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
  onUpdate: () => void;
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
  onUpdate
}) => {
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

    setRect({
      top: imgBounds.top - containerBounds.top + workspaceRef.current.scrollTop,
      left: imgBounds.left - containerBounds.left + workspaceRef.current.scrollLeft,
      width: imgBounds.width,
      height: imgBounds.height
    });

    setLiveSize({
      width: Math.round(imgBounds.width),
      height: Math.round(imgBounds.height)
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

  // Align image
  const setAlignment = (align: 'center' | 'left' | 'right') => {
    if (!selectedImage) return;
    setImageAlignment(align);
    selectedImage.style.display = 'block';
    selectedImage.style.float = 'none';

    if (align === 'center') {
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = 'auto';
    } else if (align === 'left') {
      selectedImage.style.marginLeft = '0';
      selectedImage.style.marginRight = 'auto';
    } else if (align === 'right') {
      selectedImage.style.marginLeft = 'auto';
      selectedImage.style.marginRight = '0';
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

  // Preset sizes
  const applyPresetWidth = (pct: number) => {
    if (!selectedImage) return;
    selectedImage.style.width = `${pct}%`;
    selectedImage.style.height = 'auto';
    selectedImage.style.maxWidth = '100%';
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
      {/* CANVA PURPLE BOUNDING BOX (2px solid #8b5cf6)                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute inset-0 border-2 border-[#8b5cf6] pointer-events-none rounded-xs shadow-xs" />

      {/* ----------------------------------------------------------------- */}
      {/* LIVE DIMENSION PILL (w: 1,638 h: 2,334) - Visible when Resizing   */}
      {/* ----------------------------------------------------------------- */}
      {(isResizing || liveSize) && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-9 px-2.5 py-1 bg-gray-900/90 text-white font-mono text-[11px] font-semibold rounded-md shadow-xl backdrop-blur-xs border border-gray-700 pointer-events-none flex items-center gap-1.5 transition-opacity duration-150 ${
            isResizing ? 'opacity-100 scale-105' : 'opacity-85'
          }`}
        >
          <span className="text-purple-300">w:</span>
          <span>{liveSize?.width.toLocaleString()}</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-300">h:</span>
          <span>{liveSize?.height.toLocaleString()}</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 4 CORNER HANDLES (Canva-style circular drag nodes)                */}
      {/* ----------------------------------------------------------------- */}
      {!isLocked && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tl')}
            className="pointer-events-auto absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nwse-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#8b5cf6] transition-transform"
            title="Resize (چھوٹا / بڑا کریں)"
          />

          {/* Top-Right */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'tr')}
            className="pointer-events-auto absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#8b5cf6] transition-transform"
            title="Resize (چھوٹا / بڑا کریں)"
          />

          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'bl')}
            className="pointer-events-auto absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nesw-resize shadow-md hover:scale-130 active:scale-130 active:bg-[#8b5cf6] transition-transform"
            title="Resize (چھوٹا / بڑا کریں)"
          />

          {/* Bottom-Right (Main handle highlighted in user video) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'br')}
            className="pointer-events-auto absolute -bottom-2 -right-2 w-4 h-4 bg-[#8b5cf6] border-2 border-white rounded-full cursor-nwse-resize shadow-md ring-2 ring-[#8b5cf6]/40 hover:scale-135 active:scale-135 transition-transform"
            title="Resize Image (تصویر کا سائز بدلیں)"
          />

          {/* --------------------------------------------------------------- */}
          {/* 4 EDGE PILL HANDLES (Canva side resize bars)                     */}
          {/* --------------------------------------------------------------- */}
          {/* Top Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 't')}
            className="pointer-events-auto absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white border border-[#8b5cf6] rounded-full cursor-ns-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-purple-100 transition-transform"
            title="Adjust Height"
          />

          {/* Bottom Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'b')}
            className="pointer-events-auto absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white border border-[#8b5cf6] rounded-full cursor-ns-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-purple-100 transition-transform"
            title="Adjust Height"
          />

          {/* Left Edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'l')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -left-1 w-1.5 h-6 bg-white border border-[#8b5cf6] rounded-full cursor-ew-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-purple-100 transition-transform"
            title="Adjust Width"
          />

          {/* Right Edge (Pill handle shown in user video at 00:05) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'r')}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-6 bg-white border border-[#8b5cf6] rounded-full cursor-ew-resize shadow-xs hover:scale-120 active:scale-120 hover:bg-purple-100 transition-transform"
            title="Adjust Width (چوڑائی بدلیں)"
          />
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* FLOATING CANVA ACTION BAR (Directly below image)                  */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-full mt-3 flex items-center gap-1 bg-white/95 backdrop-blur-md text-gray-700 px-2.5 py-1.5 rounded-xl shadow-xl border border-gray-200 z-40 text-xs animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Quick Size Presets */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          {[30, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyPresetWidth(pct)}
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded hover:bg-purple-50 hover:text-[#8b5cf6] transition text-gray-600"
              title={`Set to ${pct}% width`}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-1 rounded transition ${
              imageAlignment === 'left' ? 'bg-purple-100 text-[#8b5cf6]' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Left (بائیں)"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-1 rounded transition ${
              imageAlignment === 'center' ? 'bg-purple-100 text-[#8b5cf6]' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Center (درمیان)"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`p-1 rounded transition ${
              imageAlignment === 'right' ? 'bg-purple-100 text-[#8b5cf6]' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Right (دائیں)"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rounded Corners */}
        <button
          type="button"
          onClick={toggleCorners}
          className={`px-1.5 py-1 text-[11px] font-medium rounded transition ${
            imageRounded !== 'none' ? 'bg-purple-50 text-[#8b5cf6] font-semibold' : 'hover:bg-gray-100'
          }`}
          title="Toggle Rounded Corners (گولائی)"
        >
          {imageRounded === 'none' ? 'Square' : imageRounded === 'md' ? 'Rounded' : 'Circle'}
        </button>

        {/* Shadow */}
        <button
          type="button"
          onClick={toggleShadow}
          className={`px-1.5 py-1 text-[11px] font-medium rounded transition ${
            imageShadow ? 'bg-purple-50 text-[#8b5cf6] font-semibold' : 'hover:bg-gray-100'
          }`}
          title="Toggle Shadow (سایہ)"
        >
          Shadow
        </button>

        {/* Lock / Unlock */}
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`p-1 rounded transition ${
            isLocked ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title={isLocked ? 'Unlock Image' : 'Lock Image'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded transition"
          title="Duplicate Image (کاپی کریں)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
          title="Delete Image (تصویر ڈیلیٹ کریں)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Close Selection */}
        <button
          type="button"
          onClick={onDeselect}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
          title="Deselect (بند کریں)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
