import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Maximize2, Layout } from 'lucide-react';
import { PageSize } from '../types';

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomSize: (config: {
    name: string;
    width: string;
    minHeight: string;
    pageSize: PageSize;
  }) => void;
}

export const CustomSizeModal: React.FC<CustomSizeModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomSize
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'A4' | 'Letter' | 'Legal' | 'A5' | 'Book' | 'Square' | 'Custom'>('A4');
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [unit, setUnit] = useState<'mm' | 'px' | 'in'>('mm');

  if (!isOpen) return null;

  const presets = [
    { id: 'A4', name: 'A4 Document', dim: '210 × 297 mm', width: '210mm', minHeight: '297mm', desc: 'Standard international print format' },
    { id: 'Letter', name: 'US Letter', dim: '8.5 × 11 in', width: '216mm', minHeight: '279mm', desc: 'Standard business paper in Americas' },
    { id: 'Legal', name: 'US Legal', dim: '8.5 × 14 in', width: '216mm', minHeight: '356mm', desc: 'Contracts and formal deeds' },
    { id: 'A5', name: 'A5 Booklet', dim: '148 × 210 mm', width: '148mm', minHeight: '210mm', desc: 'Urdu poetry books and journals' },
    { id: 'Book', name: 'Crown Octavo Book', dim: '186 × 123 mm', width: '123mm', minHeight: '186mm', desc: 'Standard Urdu novel & prose size' },
    { id: 'Square', name: 'Square Card (1:1)', dim: '200 × 200 mm', width: '200mm', minHeight: '200mm', desc: 'Quotes, poetry graphics & social' }
  ];

  const handleApply = () => {
    if (selectedPreset === 'Custom') {
      onApplyCustomSize({
        name: `Custom (${customWidth}x${customHeight}${unit})`,
        width: `${customWidth}${unit}`,
        minHeight: `${customHeight}${unit}`,
        pageSize: 'Custom'
      });
    } else {
      const preset = presets.find((p) => p.id === selectedPreset);
      if (preset) {
        onApplyCustomSize({
          name: preset.name,
          width: preset.width,
          minHeight: preset.minHeight,
          pageSize: preset.id as PageSize
        });
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 border border-gray-100"
        >
          <div className="flex items-start justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Custom Document Dimensions</h2>
            </div>
            <button
              id="btn-close-custom-size-modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Choose Page Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id as any)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    selectedPreset === preset.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs text-gray-900">{preset.name}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{preset.dim}</p>
                  </div>
                  {selectedPreset === preset.id && (
                    <span className="absolute top-2 right-2 text-blue-600">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom inputs */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700">Or define custom dimensions:</span>
                <div className="flex bg-white rounded-lg border border-gray-300 p-0.5 text-xs">
                  {(['mm', 'px', 'in'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        unit === u ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-1">Width ({unit})</label>
                  <input
                    id="input-custom-width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(Number(e.target.value));
                      setSelectedPreset('Custom');
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-1">Height ({unit})</label>
                  <input
                    id="input-custom-height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(Number(e.target.value));
                      setSelectedPreset('Custom');
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              id="btn-cancel-custom-size"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              id="btn-apply-custom-size"
              onClick={handleApply}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition"
            >
              Create Document
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
