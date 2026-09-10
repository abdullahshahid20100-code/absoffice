import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export function isColorDark(hexColor: string): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace('#', '');
  let r = 255;
  let g = 255;
  let b = 255;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance < 135;
}

// Clean page background color palette (no text written on colors, pure swatches like text color picker)
export const PAGE_COLORS = [
  '#ffffff', // Pure White
  '#fafafa', // Snow White
  '#fffbeb', // Warm Cream Ivory
  '#fef3c7', // Warm Amber Paper
  '#fef9c3', // Antique Paper
  '#f0fdf4', // Soft Mint
  '#f0f9ff', // Soft Sky Blue
  '#fdf2f8', // Soft Rose Blush
  '#f5f3ff', // Lavender Mist
  '#f5ebe0', // Warm Papyrus Beige
  '#f1f5f9', // Pearl Slate
  '#334155', // Slate Charcoal
  '#1e293b', // Dark Slate
  '#111111', // Jet Dark
  '#064e3b'  // Royal Emerald
];

interface PageColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onSelectColor: (color: string) => void;
  textColor?: string;
  onSetTextColor?: (color: string) => void;
}

export const PageColorModal: React.FC<PageColorModalProps> = ({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
  textColor = '#111111',
  onSetTextColor
}) => {
  const [customInput, setCustomInput] = useState<string>(currentColor || '#ffffff');

  useEffect(() => {
    setCustomInput(currentColor || '#ffffff');
  }, [currentColor]);

  if (!isOpen) return null;

  const handleColorClick = (color: string) => {
    setCustomInput(color);
    onSelectColor(color);

    // If dark background selected and text is dark, switch text to white for readability
    if (isColorDark(color) && isColorDark(textColor) && onSetTextColor) {
      onSetTextColor('#ffffff');
    } else if (!isColorDark(color) && !isColorDark(textColor) && onSetTextColor) {
      onSetTextColor('#111111');
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onSelectColor(val);
      if (isColorDark(val) && isColorDark(textColor) && onSetTextColor) {
        onSetTextColor('#ffffff');
      } else if (!isColorDark(val) && !isColorDark(textColor) && onSetTextColor) {
        onSetTextColor('#111111');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-5 space-y-3.5 text-xs text-gray-700 animate-in zoom-in-95 duration-150 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-900 text-base">
          <span>Page Color (ورق کا رنگ)</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Preset Color Swatches - exactly like Text Color */}
        <div className="grid grid-cols-5 gap-2.5">
          {PAGE_COLORS.map((hex) => {
            const isSelected = currentColor.toLowerCase() === hex.toLowerCase();
            const dark = isColorDark(hex);
            return (
              <button
                key={hex}
                type="button"
                onClick={() => handleColorClick(hex)}
                className="w-10 h-10 rounded-xl border border-gray-300 hover:scale-110 transition shadow-2xs flex items-center justify-center relative cursor-pointer"
                style={{ backgroundColor: hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${dark ? 'text-white' : 'text-gray-900'} drop-shadow-sm`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Color Input */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-600 font-semibold">Custom:</span>
          <input
            type="color"
            value={customInput}
            onChange={(e) => handleColorClick(e.target.value)}
            className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer p-0 bg-transparent"
          />
          <input
            type="text"
            value={customInput}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="flex-1 text-xs font-mono px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center uppercase"
          />
        </div>

        {/* Footer Done Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
