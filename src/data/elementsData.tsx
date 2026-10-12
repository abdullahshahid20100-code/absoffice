import React from 'react';

export type ElementCategory =
  | 'all'
  | 'shapes'
  | 'lines'
  | 'english'
  | 'islamic'
  | 'dividers'
  | 'brackets';

export type ShapeStyleMode = 'fill' | 'outline' | 'tint';

export interface ElementItem {
  id: string;
  name: string;
  urduName: string;
  category: 'shapes' | 'lines' | 'english' | 'islamic' | 'dividers' | 'brackets';
  tags: string[];
  type: 'svg' | 'html' | 'text';
  // Generates HTML/SVG string to insert into document based on color & style
  getHtml: (color: string, mode: ShapeStyleMode) => string;
  // Visual preview SVG or markup for the sidebar grid
  renderPreview: (color: string, mode: ShapeStyleMode) => React.ReactNode;
}

// Curated colors for fast 1-click selection (including theme palette)
export const POPULAR_COLORS = [
  { name: 'Deep Teal (Theme)', hex: '#005461' },
  { name: 'Ocean Teal (Theme)', hex: '#018790' },
  { name: 'Bright Turquoise (Theme)', hex: '#00b7b5' },
  { name: 'Crisp Neutral', hex: '#f4f4f4' },
  { name: 'Black', hex: '#111827' },
  { name: 'Slate', hex: '#4b5563' },
  { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Canva Purple', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Pure White', hex: '#ffffff' }
];

// Helper to compute stroke/fill for SVGs based on styleMode
export function getSvgStyle(color: string, mode: ShapeStyleMode, defaultFill = true) {
  if (mode === 'outline') {
    return {
      fill: 'none',
      stroke: color,
      strokeWidth: '2.5',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const
    };
  }
  if (mode === 'tint') {
    return {
      fill: color.startsWith('#') ? `${color}20` : 'rgba(124, 58, 237, 0.12)',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const
    };
  }
  // Fill mode
  return {
    fill: color,
    stroke: color,
    strokeWidth: '1',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
}

// Helper to create wrapper for document insertion
export function wrapElementBlock(innerSvgOrHtml: string, align: 'center' | 'inline' = 'center', extraAttrs: string = '') {
  if (align === 'inline') {
    return `<span class="doc-element-inline" data-doc-element="true" contenteditable="false" style="display: inline-block; vertical-align: middle; margin: 0 4px; user-select: none; cursor: pointer;" ${extraAttrs}>${innerSvgOrHtml}</span>&nbsp;`;
  }
  return `<div class="doc-element-block" data-doc-element="true" contenteditable="false" style="text-align: center; margin: 16px auto; user-select: none; display: flex; justify-content: center; align-items: center; cursor: pointer;" ${extraAttrs}>${innerSvgOrHtml}</div><p><br></p>`;
}

// -------------------------------------------------------------
// SHAPES LIST (Geometric, Lines, Arrows, Badges)
// -------------------------------------------------------------
export const ALL_ELEMENTS: ElementItem[] = [
  // 1. RECTANGLE
  {
    id: 'shape-rect',
    name: 'Rectangle',
    urduName: 'مستطیل',
    category: 'shapes',
    tags: ['rectangle', 'box', 'square', 'چوکور', 'مستطیل', 'ڈبہ', 'shape'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      const stroke = color;
      const strokeW = mode === 'outline' ? '3' : '1.5';
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90" style="display: inline-block; vertical-align: middle; max-width: 100%; height: auto;">
          <rect x="4" y="4" width="132" height="82" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 40 30" className="w-full h-full p-1">
          <rect x="2" y="2" width="36" height="26" rx="2" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
        </svg>
      );
    }
  },

  // 2. ROUNDED RECTANGLE
  {
    id: 'shape-rounded-rect',
    name: 'Rounded Rectangle',
    urduName: 'گول کونوں والا مستطیل',
    category: 'shapes',
    tags: ['rounded', 'rectangle', 'pill', 'card', 'گول', 'مستطیل'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90" style="display: inline-block; max-width: 100%; height: auto;">
          <rect x="4" y="4" width="132" height="82" rx="18" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 40 30" className="w-full h-full p-1">
          <rect x="2" y="2" width="36" height="26" rx="8" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
        </svg>
      );
    }
  },

  // 3. CIRCLE
  {
    id: 'shape-circle',
    name: 'Circle',
    urduName: 'دائرہ',
    category: 'shapes',
    tags: ['circle', 'round', 'dot', 'دائرہ', 'گول'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" style="display: inline-block; max-width: 100%; height: auto;">
          <circle cx="50" cy="50" r="44" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <circle cx="18" cy="18" r="14" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2.5 : 1} />
        </svg>
      );
    }
  },

  // 4. ELLIPSE (OVAL)
  {
    id: 'shape-ellipse',
    name: 'Oval / Ellipse',
    urduName: 'بیضوی شکل',
    category: 'shapes',
    tags: ['oval', 'ellipse', 'egg', 'بیضوی'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90" style="display: inline-block;">
          <ellipse cx="70" cy="45" rx="64" ry="38" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 40 30" className="w-full h-full p-1">
          <ellipse cx="20" cy="15" rx="17" ry="11" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
        </svg>
      );
    }
  },

  // 5. TRIANGLE
  {
    id: 'shape-triangle',
    name: 'Triangle',
    urduName: 'مثلث',
    category: 'shapes',
    tags: ['triangle', 'pyramid', 'مثلث', 'تکون'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="90" viewBox="0 0 100 90" style="display: inline-block;">
          <polygon points="50,6 94,84 6,84" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 32" className="w-full h-full p-1">
          <polygon points="18,3 33,29 3,29" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 6. 5-POINT STAR
  {
    id: 'shape-star-5',
    name: 'Star (5-Point)',
    urduName: 'ستارہ (پانچ کونے)',
    category: 'shapes',
    tags: ['star', 'favorite', 'rating', 'ستارہ', 'نجم', 'five star'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" style="display: inline-block;">
          <polygon points="50,5 64,36 98,39 72,62 80,95 50,77 20,95 28,62 2,39 36,36" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <polygon points="18,2 23,13 35,14 26,22 29,34 18,27 7,34 10,22 1,14 13,13" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 7. 4-POINT STAR (SPARKLE)
  {
    id: 'shape-sparkle-star',
    name: 'Sparkle Star (4-Point)',
    urduName: 'چمکیلا ستارہ (چار کونے)',
    category: 'shapes',
    tags: ['sparkle', 'star', 'shine', 'magic', 'glitter', 'ستارہ', 'چمک'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 100 100" style="display: inline-block;">
          <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <path d="M18 0 Q18 18 36 18 Q18 18 18 36 Q18 18 0 18 Q18 18 18 0 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
        </svg>
      );
    }
  },

  // 8. 8-POINT ISLAMIC STAR (OCTAGRAM)
  {
    id: 'shape-star-8',
    name: '8-Point Islamic Star',
    urduName: 'آٹھ کونی ستارہ (اسلامی ہندسہ)',
    category: 'shapes',
    tags: ['islamic star', 'rub el hizb', 'octagram', 'ستارہ', 'اسلامی'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" style="display: inline-block;">
          <polygon points="50,4 63,22 85,15 85,37 100,50 85,63 85,85 63,78 50,96 37,78 15,85 15,63 0,50 15,37 15,15 37,22" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <polygon points="18,1 23,8 31,5 31,13 36,18 31,23 31,31 23,28 18,35 13,28 5,31 5,23 0,18 5,13 5,5 13,8" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 1.5 : 0.8} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 9. DIAMOND (RHOMBUS)
  {
    id: 'shape-diamond',
    name: 'Diamond / Rhombus',
    urduName: 'معین / ہیرا شکل',
    category: 'shapes',
    tags: ['diamond', 'rhombus', 'gem', 'ہیرا', 'معین'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" style="display: inline-block;">
          <polygon points="50,4 96,50 50,96 4,50" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <polygon points="18,2 34,18 18,34 2,18" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 10. HEXAGON
  {
    id: 'shape-hexagon',
    name: 'Hexagon',
    urduName: 'مسدس (چھ کونے)',
    category: 'shapes',
    tags: ['hexagon', 'polygon', 'honeycomb', 'مسدس', 'چھ کونے'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="90" viewBox="0 0 100 90" style="display: inline-block;">
          <polygon points="25,5 75,5 96,45 75,85 25,85 4,45" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 32" className="w-full h-full p-1">
          <polygon points="9,2 27,2 35,16 27,30 9,30 1,16" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 11. HEART
  {
    id: 'shape-heart',
    name: 'Heart',
    urduName: 'دل',
    category: 'shapes',
    tags: ['heart', 'love', 'like', 'دل', 'محبت', 'favorite'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="90" viewBox="0 0 100 90" style="display: inline-block;">
          <path d="M50,82 C50,82 10,54 10,26 C10,12 22,4 34,4 C42,4 48,10 50,14 C52,10 58,4 66,4 C78,4 90,12 90,26 C90,54 50,82 50,82 Z" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 32" className="w-full h-full p-1">
          <path d="M18,30 C18,30 3,19 3,9 C3,4 7,1 12,1 C15,1 17,3 18,5 C19,3 21,1 24,1 C29,1 33,4 33,9 C33,19 18,30 18,30 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 12. SPEECH BUBBLE (CALLOUT)
  {
    id: 'shape-speech-bubble',
    name: 'Speech Bubble',
    urduName: 'مکالمہ ببل (Callout)',
    category: 'shapes',
    tags: ['speech', 'bubble', 'chat', 'message', 'dialogue', 'مکالمہ', 'بات'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90" style="display: inline-block;">
          <path d="M10,10 H110 C114,10 116,12 116,16 V64 C116,68 114,70 110,70 H40 L20,86 V70 H10 C6,70 4,68 4,64 V16 C4,12 6,10 10,10 Z" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 40 30" className="w-full h-full p-1">
          <path d="M4,3 H36 C38,3 39,4 39,5 V21 C39,22 38,23 36,23 H15 L8,29 V23 H4 C2,23 1,22 1,21 V5 C1,4 2,3 4,3 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 13. CLOUD
  {
    id: 'shape-cloud',
    name: 'Cloud',
    urduName: 'بادل کی شکل',
    category: 'shapes',
    tags: ['cloud', 'weather', 'بادل', 'موسم'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80" style="display: inline-block;">
          <path d="M28,68 H96 C107,68 116,59 116,48 C116,38 108,30 98,28 C96,16 85,6 72,6 C63,6 54,11 50,19 C46,15 40,12 34,12 C21,12 10,23 10,36 C4,41 0,48 0,56 C0,67 9,76 20,76" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 26" className="w-full h-full p-1">
          <path d="M8,22 H28 C32,22 35,19 35,15 C35,12 33,9 29,9 C28,5 25,2 21,2 C18,2 15,4 14,7 C13,5 11,4 9,4 C5,4 2,7 2,11 C1,13 0,15 0,17 C0,20 3,22 8,22 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 1.8 : 1} />
        </svg>
      );
    }
  },

  // 14. SHIELD
  {
    id: 'shape-shield',
    name: 'Shield / Security',
    urduName: 'ڈھال / حفاظت',
    category: 'shapes',
    tags: ['shield', 'protection', 'security', 'badge', 'ڈھال', 'حفاظت'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="110" viewBox="0 0 100 110" style="display: inline-block;">
          <path d="M50,4 L92,20 V56 C92,84 50,106 50,106 C50,106 8,84 8,56 V20 Z" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '2'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 32 36" className="w-full h-full p-1">
          <path d="M16,1 L30,6 V18 C30,27 16,34 16,34 C16,34 2,27 2,18 V6 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} strokeLinejoin="round" />
        </svg>
      );
    }
  },

  // 15. CRESCENT MOON
  {
    id: 'shape-crescent',
    name: 'Crescent Moon',
    urduName: 'ہلال / چاند',
    category: 'shapes',
    tags: ['crescent', 'moon', 'hilal', 'چاند', 'ہلال', 'night'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 100 100" style="display: inline-block;">
          <path d="M80,8 C46,14 20,44 26,78 C30,96 46,108 64,108 C74,108 84,104 92,98 C64,96 44,72 44,44 C44,28 54,14 68,6 C72,4 76,2 80,8 Z" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '3' : '1.5'}" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 36 36" className="w-full h-full p-1">
          <path d="M28,3 C16,5 7,16 9,28 C11,34 16,39 23,39 C26,39 30,38 33,35 C23,34 16,26 16,16 C16,10 20,5 25,2 C26,1 27,1 28,3 Z" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
        </svg>
      );
    }
  },

  // 16. AWARD RIBBON (ROSETTE)
  {
    id: 'shape-rosette',
    name: 'Award Rosette Ribbon',
    urduName: 'انعامی تمغہ و ربن',
    category: 'shapes',
    tags: ['award', 'ribbon', 'medal', 'rosette', 'تمغہ', 'انعام'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120" style="display: inline-block;">
          <circle cx="50" cy="46" r="38" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '4' : '2'}" />
          <circle cx="50" cy="46" r="26" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3" />
          <polygon points="34,80 20,116 38,106 50,116 46,84" fill="${fill}" stroke="${color}" stroke-width="2" />
          <polygon points="66,80 80,116 62,106 50,116 54,84" fill="${fill}" stroke="${color}" stroke-width="2" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}22` : color;
      return (
        <svg viewBox="0 0 32 38" className="w-full h-full p-1">
          <circle cx="16" cy="15" r="12" fill={fill} stroke={color} strokeWidth={mode === 'outline' ? 2 : 1} />
          <polygon points="11,26 6,37 12,34 16,37 15,27" fill={fill} stroke={color} strokeWidth={1} />
          <polygon points="21,26 26,37 20,34 16,37 17,27" fill={fill} stroke={color} strokeWidth={1} />
        </svg>
      );
    }
  },

  // -----------------------------------------------------------
  // LINES & ARROWS
  // -----------------------------------------------------------
  // 17. SOLID HORIZONTAL LINE
  {
    id: 'line-solid',
    name: 'Solid Divider Line',
    urduName: 'سیدھی لکیر',
    category: 'lines',
    tags: ['line', 'solid', 'divider', 'لکیر', 'خط'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div class="doc-line-inner" data-element-type="line" data-line-style="solid" style="width: 380px; max-width: 100%; height: 3px; background-color: ${color}; border-radius: 2px; margin: 16px auto; transition: width 0.15s ease;"></div>
      `, 'center', 'data-element-type="line"');
    },
    renderPreview: (color) => (
      <div className="w-full flex items-center justify-center h-full px-2">
        <div className="w-full h-1 rounded" style={{ backgroundColor: color }} />
      </div>
    )
  },

  // 18. DASHED LINE
  {
    id: 'line-dashed',
    name: 'Dashed Line',
    urduName: 'کٹی لکیر (Dashed)',
    category: 'lines',
    tags: ['line', 'dashed', 'divider', 'کٹی لکیر'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div class="doc-line-inner" data-element-type="line" data-line-style="dashed" style="width: 380px; max-width: 100%; border-bottom: 2.5px dashed ${color}; margin: 16px auto; transition: width 0.15s ease;"></div>
      `, 'center', 'data-element-type="line"');
    },
    renderPreview: (color) => (
      <div className="w-full flex items-center justify-center h-full px-2">
        <div className="w-full border-b-2 border-dashed" style={{ borderColor: color }} />
      </div>
    )
  },

  // 19. DOTTED LINE
  {
    id: 'line-dotted',
    name: 'Dotted Line',
    urduName: 'نقطہ دار لکیر (Dotted)',
    category: 'lines',
    tags: ['line', 'dotted', 'dots', 'نقطے'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div class="doc-line-inner" data-element-type="line" data-line-style="dotted" style="width: 380px; max-width: 100%; border-bottom: 3px dotted ${color}; margin: 16px auto; transition: width 0.15s ease;"></div>
      `, 'center', 'data-element-type="line"');
    },
    renderPreview: (color) => (
      <div className="w-full flex items-center justify-center h-full px-2">
        <div className="w-full border-b-2 border-dotted" style={{ borderColor: color }} />
      </div>
    )
  },

  // 20. DOUBLE LINE
  {
    id: 'line-double',
    name: 'Double Parallel Line',
    urduName: 'دوہری لکیر',
    category: 'lines',
    tags: ['line', 'double', 'parallel', 'دوہری لکیر'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div class="doc-line-inner" data-element-type="line" data-line-style="double" style="width: 380px; max-width: 100%; border-bottom: 4px double ${color}; margin: 16px auto; transition: width 0.15s ease;"></div>
      `, 'center', 'data-element-type="line"');
    },
    renderPreview: (color) => (
      <div className="w-full flex items-center justify-center h-full px-2">
        <div className="w-full border-b-4 border-double" style={{ borderColor: color }} />
      </div>
    )
  },

  // 21. RIGHT ARROW
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    urduName: 'دائیں تیر کا نشان',
    category: 'lines',
    tags: ['arrow', 'right', 'next', 'pointer', 'تیر', 'دائیں'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="36" viewBox="0 0 120 36" style="display: inline-block;">
          <polygon points="10,14 80,14 80,4 116,18 80,32 80,22 10,22" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '2.5' : '1'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 40 18" className="w-full h-full p-1">
        <polygon points="2,7 26,7 26,2 38,9 26,16 26,11 2,11" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth={mode === 'outline' ? 1.5 : 0.8} />
      </svg>
    )
  },

  // 22. LEFT ARROW
  {
    id: 'arrow-left',
    name: 'Arrow Left',
    urduName: 'بائیں تیر کا نشان',
    category: 'lines',
    tags: ['arrow', 'left', 'back', 'تیر', 'بائیں'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="36" viewBox="0 0 120 36" style="display: inline-block;">
          <polygon points="110,14 40,14 40,4 4,18 40,32 40,22 110,22" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '2.5' : '1'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 40 18" className="w-full h-full p-1">
        <polygon points="38,7 14,7 14,2 2,9 14,16 14,11 38,11" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth={mode === 'outline' ? 1.5 : 0.8} />
      </svg>
    )
  },

  // 23. TWO-WAY ARROW (BIDIRECTIONAL)
  {
    id: 'arrow-bidirectional',
    name: 'Bidirectional Arrow (↔)',
    urduName: 'دو طرفہ تیر',
    category: 'lines',
    tags: ['arrow', 'bidirectional', 'both', '↔', 'دو طرفہ'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="36" viewBox="0 0 130 36" style="display: inline-block;">
          <polygon points="34,6 4,18 34,30 34,22 96,22 96,30 126,18 96,6 96,14 34,14" fill="${fill}" stroke="${color}" stroke-width="${mode === 'outline' ? '2.5' : '1'}" stroke-linejoin="round" />
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 42 16" className="w-full h-full p-1">
        <polygon points="10,2 1,8 10,14 10,10 32,10 32,14 41,8 32,2 32,6 10,6" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth={mode === 'outline' ? 1.5 : 0.8} />
      </svg>
    )
  },

  // 24. CURVED ARROW
  {
    id: 'arrow-curved',
    name: 'Curved Turn Arrow',
    urduName: 'مڑا ہوا تیر',
    category: 'lines',
    tags: ['arrow', 'curved', 'turn', 'rotate', 'مڑا ہوا'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 100 100" style="display: inline-block;">
          <path d="M20,80 C20,30 50,20 80,20" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" />
          <polygon points="74,8 96,20 74,32" fill="${color}" />
        </svg>
      `);
    },
    renderPreview: (color) => (
      <svg viewBox="0 0 36 36" className="w-full h-full p-1">
        <path d="M6,28 C6,10 18,7 30,7" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
        <polygon points="26,2 34,7 26,12" fill={color} />
      </svg>
    )
  },

  // -----------------------------------------------------------
  // ENGLISH ELEMENTS & BADGES
  // -----------------------------------------------------------
  // 25. BADGE: APPROVED
  {
    id: 'badge-approved',
    name: 'Approved Badge',
    urduName: 'منظور شدہ بیج (Approved)',
    category: 'english',
    tags: ['approved', 'badge', 'stamp', 'check', 'verified', 'منظور', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}15` : `${color}10`;
      return wrapElementBlock(`
        <div style="display: inline-flex; align-items: center; gap: 8px; border: 2.5px solid ${color}; background-color: ${fill}; color: ${color}; padding: 6px 16px; border-radius: 9999px; font-family: sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>APPROVED</span>
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center p-0.5">
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full border border-current font-sans tracking-tight" style={{ color }}>
          ✓ APPROVED
        </span>
      </div>
    )
  },

  // 26. BADGE: OFFICIAL
  {
    id: 'badge-official',
    name: 'Official Seal Stamp',
    urduName: 'سرکاری مہر (Official)',
    category: 'english',
    tags: ['official', 'stamp', 'seal', 'certified', 'سرکاری', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : mode === 'tint' ? `${color}15` : `${color}0d`;
      return wrapElementBlock(`
        <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; border: 3px double ${color}; background-color: ${fill}; color: ${color}; padding: 8px 24px; border-radius: 8px; font-family: serif; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
          <div style="font-size: 11px; letter-spacing: 3px;">★ ★ ★</div>
          <div style="font-size: 16px; font-weight: bold; margin: 2px 0;">OFFICIAL</div>
          <div style="font-size: 9px; letter-spacing: 1.5px; opacity: 0.85;">DOCUMENT</div>
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex flex-col items-center justify-center p-0.5">
        <div className="border border-current rounded px-1.5 py-0.5 text-center" style={{ color }}>
          <div className="text-[7px] font-mono leading-none">★ ★</div>
          <div className="text-[8px] font-bold font-serif leading-none tracking-wider">OFFICIAL</div>
        </div>
      </div>
    )
  },

  // 27. BADGE: CONFIDENTIAL
  {
    id: 'badge-confidential',
    name: 'Confidential Stamp',
    urduName: 'صیغہ راز (Confidential)',
    category: 'english',
    tags: ['confidential', 'secret', 'stamp', 'راز', 'خفیہ', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      return wrapElementBlock(`
        <div style="display: inline-block; border: 3px solid ${color}; color: ${color}; padding: 6px 18px; font-family: Impact, sans-serif; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; transform: rotate(-3deg); border-radius: 4px; box-shadow: 2px 2px 0 ${color}33;">
          CONFIDENTIAL
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[8px] font-black border border-current px-1 py-0.5 rounded uppercase tracking-widest font-mono" style={{ color }}>
          SECRET
        </span>
      </div>
    )
  },

  // 28. BADGE: URGENT
  {
    id: 'badge-urgent',
    name: 'Urgent Pill',
    urduName: 'فوری ضروری (Urgent)',
    category: 'english',
    tags: ['urgent', 'important', 'alert', 'ضروری', 'فوری', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const bg = mode === 'outline' ? 'none' : color;
      const text = mode === 'outline' ? color : '#ffffff';
      return wrapElementBlock(`
        <span style="display: inline-block; background-color: ${bg}; color: ${text}; border: 2px solid ${color}; font-family: sans-serif; font-weight: 800; font-size: 12px; padding: 4px 14px; border-radius: 9999px; letter-spacing: 1.5px; text-transform: uppercase;">
          ⚡ URGENT
        </span>
      `);
    },
    renderPreview: (color, mode) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full font-sans tracking-wider" style={{ backgroundColor: mode === 'outline' ? 'transparent' : color, color: mode === 'outline' ? color : '#fff', border: `1px solid ${color}` }}>
          URGENT
        </span>
      </div>
    )
  },

  // 29. BADGE: VERIFIED
  {
    id: 'badge-verified',
    name: 'Verified Guarantee Seal',
    urduName: 'تصدیق شدہ نشان (Verified)',
    category: 'english',
    tags: ['verified', 'guaranteed', 'check', 'seal', 'تصدیق', 'english'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div style="display: inline-flex; align-items: center; gap: 6px; background-color: ${color}15; border: 2px solid ${color}; color: ${color}; padding: 6px 14px; border-radius: 8px; font-family: sans-serif; font-weight: 700; font-size: 13px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
          <span>VERIFIED 100%</span>
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[8px] font-bold border border-current px-1.5 py-0.5 rounded flex items-center gap-1 font-sans" style={{ color }}>
          ★ VERIFIED
        </span>
      </div>
    )
  },

  // 30. ENGLISH ICON: TROPHY / AWARD
  {
    id: 'icon-trophy',
    name: 'Trophy Award',
    urduName: 'کپ / ٹرافی',
    category: 'english',
    tags: ['trophy', 'winner', 'cup', 'award', 'انعام', 'کپ', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path>
          <path d="M6 2v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
        <path d="M6 2v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    )
  },

  // 31. ENGLISH ICON: CROWN
  {
    id: 'icon-crown',
    name: 'Royal Crown',
    urduName: 'شاہی تاج (Crown)',
    category: 'english',
    tags: ['crown', 'king', 'queen', 'royal', 'تاج', 'بادشاہ', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="60" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    )
  },

  // 32. ENGLISH ICON: LAUREL WREATH
  {
    id: 'icon-laurel',
    name: 'Laurel Wreath Branches',
    urduName: 'شاخی تاج (Laurel Wreath)',
    category: 'english',
    tags: ['laurel', 'wreath', 'winner', 'branches', 'فاتح', 'پتے', 'english'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="110" height="90" viewBox="0 0 100 80" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
          <path d="M26,70 C16,50 16,30 30,12"></path>
          <path d="M74,70 C84,50 84,30 70,12"></path>
          <circle cx="24" cy="22" r="3" fill="${color}"></circle>
          <circle cx="20" cy="36" r="3" fill="${color}"></circle>
          <circle cx="20" cy="50" r="3" fill="${color}"></circle>
          <circle cx="76" cy="22" r="3" fill="${color}"></circle>
          <circle cx="80" cy="36" r="3" fill="${color}"></circle>
          <circle cx="80" cy="50" r="3" fill="${color}"></circle>
        </svg>
      `);
    },
    renderPreview: (color) => (
      <svg viewBox="0 0 40 32" className="w-full h-full p-1" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M10,28 C6,20 6,12 12,4" />
        <path d="M30,28 C34,20 34,12 28,4" />
        <circle cx="10" cy="9" r="1.5" fill={color} />
        <circle cx="8" cy="15" r="1.5" fill={color} />
        <circle cx="30" cy="9" r="1.5" fill={color} />
        <circle cx="32" cy="15" r="1.5" fill={color} />
      </svg>
    )
  },

  // 33. ENGLISH ICON: LIGHTBULB / IDEA
  {
    id: 'icon-lightbulb',
    name: 'Lightbulb / Idea',
    urduName: 'بلب / آئیڈیا',
    category: 'english',
    tags: ['idea', 'lightbulb', 'solution', 'سوچ', 'بلب', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const fill = mode === 'outline' ? 'none' : color;
      return wrapElementBlock(`
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
        </svg>
      `);
    },
    renderPreview: (color, mode) => (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill={mode === 'outline' ? 'none' : color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    )
  },

  // 34. ENGLISH CALLIGRAPHY: "THANK YOU"
  {
    id: 'text-thank-you',
    name: 'Thank You Calligraphy',
    urduName: 'شکریہ (Thank You)',
    category: 'english',
    tags: ['thank you', 'thanks', 'gratitude', 'شکریہ', 'english'],
    type: 'svg',
    getHtml: (color) => {
      return wrapElementBlock(`
        <div style="text-align: center; margin: 16px auto; font-family: 'Brush Script MT', 'Dancing Script', cursive, serif; font-size: 32px; color: ${color}; font-weight: bold; letter-spacing: 1px;">
          Thank You!
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs font-serif font-bold italic" style={{ color }}>
          Thank You
        </span>
      </div>
    )
  },

  // 35. ENGLISH CALLIGRAPHY: "CONGRATULATIONS"
  {
    id: 'text-congratulations',
    name: 'Congratulations Banner',
    urduName: 'مبارکباد (Congratulations)',
    category: 'english',
    tags: ['congratulations', 'congrats', 'mubarak', 'مبارکباد', 'english'],
    type: 'svg',
    getHtml: (color, mode) => {
      const bg = mode === 'outline' ? 'transparent' : `${color}12`;
      return wrapElementBlock(`
        <div style="display: inline-block; border: 2px solid ${color}; background-color: ${bg}; color: ${color}; padding: 8px 24px; border-radius: 12px; font-family: Georgia, serif; font-size: 16px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
          🎉 Congratulations 🎉
        </div>
      `);
    },
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center p-0.5">
        <span className="text-[7.5px] font-bold border border-current px-1 py-0.5 rounded font-serif uppercase tracking-tight truncate" style={{ color }}>
          CONGRATS
        </span>
      </div>
    )
  },

  // -----------------------------------------------------------
  // ISLAMIC SYMBOLS & CALLIGRAPHY
  // -----------------------------------------------------------
  {
    id: 'islamic-durood',
    name: 'Durood Shareef (ﷺ)',
    urduName: 'صلی اللہ علیہ وسلم',
    category: 'islamic',
    tags: ['durood', 'prophet', 'islamic', 'صلی اللہ علیہ وسلم', 'درود'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 30px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; color: ${color};">ﷺ</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xl font-bold font-nastaliq" style={{ color }}>ﷺ</span>
      </div>
    )
  },
  {
    id: 'islamic-allah',
    name: 'Allah (ﷻ)',
    urduName: 'جل جلالہ',
    category: 'islamic',
    tags: ['allah', 'islamic', 'جل جلالہ', 'اللہ'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 30px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; color: ${color};">ﷻ</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xl font-bold font-nastaliq" style={{ color }}>ﷻ</span>
      </div>
    )
  },
  {
    id: 'islamic-bismillah',
    name: 'Bismillah (﷽)',
    urduName: 'بسم اللہ الرحمن الرحیم',
    category: 'islamic',
    tags: ['bismillah', 'islamic', 'بسم اللہ', 'رحیم'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; font-size: 36px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; color: ${color};">﷽</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-lg font-bold font-nastaliq" style={{ color }}>﷽</span>
      </div>
    )
  },
  {
    id: 'islamic-razi',
    name: 'Razi Allah Anhu (ؓ)',
    urduName: 'رضی اللہ عنہ',
    category: 'islamic',
    tags: ['razi', 'sahaba', 'رضی اللہ عنہ'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 26px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; color: ${color};">ؓ</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xl font-bold font-nastaliq" style={{ color }}>ؓ</span>
      </div>
    )
  },
  {
    id: 'islamic-rehmat',
    name: 'Rehmatullah Alayh (ؒ)',
    urduName: 'رحمۃ اللہ علیہ',
    category: 'islamic',
    tags: ['rehmat', 'bujurg', 'رحمۃ اللہ علیہ'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 26px; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; color: ${color};">ؒ</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xl font-bold font-nastaliq" style={{ color }}>ؒ</span>
      </div>
    )
  },
  {
    id: 'islamic-ayah',
    name: 'Ayah End Mark (۝)',
    urduName: 'آیت کا نشان',
    category: 'islamic',
    tags: ['ayah', 'quran', 'end of ayah', 'آیت', 'قرآن'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 28px; font-family: serif; color: ${color};">۝</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold font-serif" style={{ color }}>۝</span>
      </div>
    )
  },
  {
    id: 'islamic-hizb',
    name: 'Rukoo / Rub El Hizb (۞)',
    urduName: 'حزب و رکوع نشان',
    category: 'islamic',
    tags: ['hizb', 'rukoo', 'quran', 'رکوع'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 28px; font-family: serif; color: ${color};">۞</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold font-serif" style={{ color }}>۞</span>
      </div>
    )
  },
  {
    id: 'poetry-sher',
    name: 'Poetry Couplet Mark (؂)',
    urduName: 'شعر علامت',
    category: 'islamic',
    tags: ['poetry', 'sher', 'شعر', 'علامت'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 28px; font-family: 'Jameel Noori Nastaleeq', serif; color: ${color};">؂</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold font-nastaliq" style={{ color }}>؂</span>
      </div>
    )
  },
  {
    id: 'poetry-misra',
    name: 'Poetry Line Mark (؏)',
    urduName: 'مصرعہ علامت',
    category: 'islamic',
    tags: ['misra', 'poetry', 'مصرعہ'],
    type: 'text',
    getHtml: (color) => wrapElementBlock(`<span style="font-size: 28px; font-family: 'Jameel Noori Nastaleeq', serif; color: ${color};">؏</span>`, 'inline'),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold font-nastaliq" style={{ color }}>؏</span>
      </div>
    )
  },

  // -----------------------------------------------------------
  // DECORATIVE DIVIDERS
  // -----------------------------------------------------------
  {
    id: 'div-stars',
    name: 'Star Burst Divider',
    urduName: 'ستاروں والی لکیر',
    category: 'dividers',
    tags: ['divider', 'stars', 'flourish', 'ستارے', 'آرائش'],
    type: 'html',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; color: ${color}; font-size: 16px; letter-spacing: 4px;">✦ ━━━━━━━━━━━━ ✦</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-[10px] truncate" style={{ color }}>
        ✦ ━━━━ ✦
      </div>
    )
  },
  {
    id: 'div-diamonds',
    name: 'Geometric Diamonds Divider',
    urduName: 'ہیروں والی لکیر',
    category: 'dividers',
    tags: ['divider', 'diamonds', 'خط فاصل', 'معین'],
    type: 'html',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; color: ${color}; font-size: 16px; letter-spacing: 4px;">❖ ──────────────── ❖</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-[10px] truncate" style={{ color }}>
        {"❖ ──── ❖"}
      </div>
    )
  },
  {
    id: 'div-floral',
    name: 'Floral Vine Divider',
    urduName: 'پھولوں والا خط فاصل',
    category: 'dividers',
    tags: ['floral', 'flowers', 'divider', 'پھول'],
    type: 'html',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; color: ${color}; font-size: 16px; letter-spacing: 4px;">— ❀ — ❀ — ❀ —</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-[10px] truncate" style={{ color }}>
        {"— ❀ — ❀ —"}
      </div>
    )
  },
  {
    id: 'div-vintage',
    name: 'Vintage Leaf Flourish',
    urduName: 'کلاسک پتوں والا خط فاصل',
    category: 'dividers',
    tags: ['vintage', 'leaf', 'flourish', 'کلاسک'],
    type: 'html',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; color: ${color}; font-size: 16px; letter-spacing: 3px;">❧ ════════════════ ❧</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-[10px] truncate" style={{ color }}>
        {"❧ ════ ❧"}
      </div>
    )
  },
  {
    id: 'div-rhombus-pattern',
    name: 'Rhombus Pattern Divider',
    urduName: 'چوکھٹ لڑی',
    category: 'dividers',
    tags: ['rhombus', 'pattern', 'چوکھٹ'],
    type: 'html',
    getHtml: (color) => wrapElementBlock(`<div style="text-align: center; margin: 16px 0; color: ${color}; font-size: 14px; letter-spacing: 4px;">◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆</div>`),
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-[10px] truncate" style={{ color }}>
        {"◆ ◇ ◆ ◇ ◆"}
      </div>
    )
  },

  // -----------------------------------------------------------
  // BRACKETS & QUOTES
  // -----------------------------------------------------------
  {
    id: 'br-guillemets',
    name: 'French / Urdu Guillemets (« »)',
    urduName: 'فرانسیسی اردو واوین « »',
    category: 'brackets',
    tags: ['guillemets', 'quotes', 'واوین'],
    type: 'text',
    getHtml: (color) => `<span style="color: ${color}; font-weight: bold;">«</span> تحریر یہاں لکھیں <span style="color: ${color}; font-weight: bold;">»</span>`,
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color }}>
        {"« »"}
      </div>
    )
  },
  {
    id: 'br-calligraphic',
    name: 'Calligraphic Brackets (《 》)',
    urduName: 'خطاطی بریکٹ 《 》',
    category: 'brackets',
    tags: ['calligraphic', 'brackets', 'خطاطی'],
    type: 'text',
    getHtml: (color) => `<span style="color: ${color}; font-weight: bold;">《</span> تحریر یہاں لکھیں <span style="color: ${color}; font-weight: bold;">》</span>`,
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color }}>
        {"《 》"}
      </div>
    )
  },
  {
    id: 'br-quranic',
    name: 'Quranic Ayah Brackets (﴾ ﴿)',
    urduName: 'قرآنی بریکٹ ﴾ ﴿',
    category: 'brackets',
    tags: ['quranic', 'brackets', 'قرآنی بریکٹ'],
    type: 'text',
    getHtml: (color) => `<span style="color: ${color}; font-size: 22px;">﴿</span> قرآنی آیت کا متن <span style="color: ${color}; font-size: 22px;">﴾</span>`,
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-base font-bold font-serif" style={{ color }}>
        {"﴿ ﴾"}
      </div>
    )
  },
  {
    id: 'br-tortoise',
    name: 'Tortoise Shell Brackets (〔 〕)',
    urduName: 'ٹارٹوز بریکٹ 〔 〕',
    category: 'brackets',
    tags: ['tortoise', 'brackets', 'بریکٹ'],
    type: 'text',
    getHtml: (color) => `<span style="color: ${color}; font-weight: bold;">〔</span> حوالہ یا وضاحت <span style="color: ${color}; font-weight: bold;">〕</span>`,
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color }}>
        {"〔 〕"}
      </div>
    )
  },
  {
    id: 'br-double-quotes',
    name: 'English Quotes (“ ”)',
    urduName: 'انگلش کوٹیشن “ ”',
    category: 'brackets',
    tags: ['quotes', 'english', 'کوٹیشن'],
    type: 'text',
    getHtml: (color) => `<span style="color: ${color}; font-size: 20px; font-weight: bold;">“</span> Quote here <span style="color: ${color}; font-size: 20px; font-weight: bold;">”</span>`,
    renderPreview: (color) => (
      <div className="w-full h-full flex items-center justify-center text-lg font-serif font-bold" style={{ color }}>
        {'" "'}
      </div>
    )
  }
];
