// Fancy Typography & Unicode Calligraphy Stylers for English & Urdu

export interface TextStyleOption {
  id: string;
  name: string;
  urduName: string;
  sample: string;
  type: 'english' | 'urdu';
  category: string;
}

// English Unicode Mapping Tables
const FRAKTUR_UPPER = ['𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ'];
const FRAKTUR_LOWER = ['𝔞','𝔟','𝔠','𝔡','𝔢','𝔣','𝔤','𝔥','𝔦','𝔧','𝔨','𝔩','𝔪','𝔫','𝔬','𝔭','𝔮','𝔯','𝔰','𝔱','𝔲','𝔳','𝔴','𝔵','𝔶','𝔷'];

const SCRIPT_BOLD_UPPER = ['𝓐','𝓑','𝓒','𝓓','𝓔','𝓕','𝓖','𝓗','𝓘','𝓙','𝓚','𝓛','𝓜','𝓝','𝓞','𝓟','𝓠','𝓡','𝓢','𝓣','𝓤','𝓥','𝓦','𝓧','𝓨','𝓩'];
const SCRIPT_BOLD_LOWER = ['𝓪','𝓫','𝓬','𝓭','𝓮','𝓯','𝓰','𝓱','𝓲','𝓳','𝓴','𝓵','𝓶','𝓷','𝓸','𝓹','𝓺','𝓻','𝓼','𝓽','𝓾','𝓿','𝔀','𝔁','𝔂','𝔃'];

const BUBBLE_BLACK_UPPER = ['🅐','🅑','🅒','🅓','🅔','🅕','🅖','🅗','🅘','🅙','🅚','🅛','🅜','🅝','🅞','🅟','🅠','🅡','🅢','🅣','🅤','🅥','🅦','🅧','🅨','🅩'];
const BUBBLE_BLACK_LOWER = ['🅐','🅑','🅒','🅓','🅔','🅕','🅖','🅗','🅘','🅙','🅚','🅛','🅜','🅝','🅞','🅟','🅠','🅡','🅢','🅣','🅤','🅥','🅦','🅧','🅨','🅩'];
const BUBBLE_BLACK_NUMBERS = ['⓿','❶','❷','❸','❹','❺','❻','❼','❽','❾'];

const SANS_BOLD_ITALIC_UPPER = ['𝘼','𝘽','𝘾','𝘿','𝙀','𝙁','𝙂','𝙃','𝙄','𝙅','𝙆','𝙇','𝙈','𝙉','𝙊','𝙋','𝙌','𝙍','𝙎','𝙏','𝙐','𝙑','𝙒','𝙓','𝙔','𝙕'];
const SANS_BOLD_ITALIC_LOWER = ['𝙖','𝙗','𝙘','𝙙','𝙚','𝙛','𝙜','𝙝','𝙞','𝙟','𝙠','ل','𝙢','𝙣','𝙤','𝙥','𝙦','𝙧','𝙨','𝙩','𝙪','𝙫','𝙬','𝙭','𝙮','𝙯'].map((_, idx) => {
  // exact unicode code points for sans bold italic lowercase a-z (1D622 - 1D63B)
  return String.fromCodePoint(0x1d622 + idx);
});
const SANS_BOLD_ITALIC_NUMBERS = ['𝟬','𝟭','𝟮','𝟯','𝟰','𝟱','𝟲','𝟳','𝟴','𝟵'];

const DOUBLE_STRUCK_UPPER = ['𝔸','𝔹','ℂ','𝔻','𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊','𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ'];
const DOUBLE_STRUCK_LOWER = ['𝕒','𝕓','𝕔','𝕕','𝕖','𝕗','𝕘','𝕙','𝕚','𝕛','𝕜','𝕝','𝕞','𝕟','𝕠','𝕡','𝕢','𝕣','𝕤','𝕥','𝕦','𝕧','𝕨','𝕩','𝕪','𝕫'];
const DOUBLE_STRUCK_NUMBERS = ['𝟘','𝟙','𝟚','𝟛','𝟜','𝟝','𝟞','𝟟','𝟠','𝟡'];

const CIRCLE_WHITE_UPPER = ['Ⓐ','Ⓑ','Ⓒ','Ⓓ','Ⓔ','Ⓕ','Ⓖ','Ⓗ','Ⓘ','Ⓙ','Ⓚ','Ⓛ','Ⓜ','Ⓝ','Ⓞ','Ⓟ','Ⓠ','Ⓡ','Ⓢ','Ⓣ','Ⓤ','Ⓥ','Ⓦ','Ⓧ','Ⓨ','Ⓩ'];
const CIRCLE_WHITE_LOWER = ['ⓐ','ⓑ','ⓒ','ⓓ','ⓔ','ⓕ','ⓖ','ⓗ','ⓘ','ⓙ','ⓚ','ⓛ','ⓜ','ⓝ','ⓞ','ⓟ','ⓠ','ⓡ','ⓢ','ⓣ','ⓤ','ⓥ','ⓦ','ⓧ','ⓨ','ⓩ'];
const CIRCLE_WHITE_NUMBERS = ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨'];

// Non-connecting Arabic letters that shouldn't receive a connecting tatweel after them
export const ARABIC_NON_CONNECTING = new Set(['ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'و', 'ؤ', 'ء', 'ة', 'ں', ' ']);

export function isArabicChar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 0x0600 && code <= 0x06FF) || (code >= 0x0750 && code <= 0x077F) || (code >= 0xFB50 && code <= 0xFDFF) || (code >= 0xFE70 && code <= 0xFEFF);
}

// Convert string using letter mapping tables
function mapEnglishCharacters(
  text: string,
  upperMap: string[],
  lowerMap: string[],
  numMap?: string[]
): string {
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      // A-Z
      res += upperMap[code - 65] || char;
    } else if (code >= 97 && code <= 122) {
      // a-z
      res += lowerMap[code - 97] || char;
    } else if (numMap && code >= 48 && code <= 57) {
      // 0-9
      res += numMap[code - 48] || char;
    } else {
      res += char;
    }
  }
  return res;
}

// Apply Urdu Kashida / Tatweel elongation
export function applyUrduKashida(text: string, count: number = 4): string {
  const tatweel = 'ـ'.repeat(count);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    result += char;
    // Only insert tatweel between connecting characters within a word
    if (
      isArabicChar(char) &&
      !ARABIC_NON_CONNECTING.has(char) &&
      nextChar &&
      isArabicChar(nextChar) &&
      nextChar !== ' ' &&
      nextChar !== '\n' &&
      nextChar !== 'ـ'
    ) {
      result += tatweel;
    }
  }
  return result;
}

// Apply Single Tatweel between letters (e.g. عـبـداللہ)
export function applyUrduSingleTatweel(text: string): string {
  return applyUrduKashida(text, 1);
}

// Apply Spaced letters for Urdu / Arabic (e.g. ع ب د ا ل ل ہ or word spaced)
export function applyUrduLetterSpacing(text: string): string {
  return text.split('').map((c) => (c === ' ' ? '  ' : `${c} `)).join('').trim();
}

// Transform text according to selected style ID
export function transformTextStyle(text: string, styleId: string): string {
  if (!text) return text;

  switch (styleId) {
    // English Gothic / Fraktur
    case 'style-fraktur':
    case 'fraktur':
      return mapEnglishCharacters(text, FRAKTUR_UPPER, FRAKTUR_LOWER);

    // English Bold Script Cursive
    case 'style-script-bold':
    case 'script-bold':
      return mapEnglishCharacters(text, SCRIPT_BOLD_UPPER, SCRIPT_BOLD_LOWER);

    // English Circled / Bubble Black
    case 'style-bubble-black':
    case 'bubble-black':
      return mapEnglishCharacters(text, BUBBLE_BLACK_UPPER, BUBBLE_BLACK_LOWER, BUBBLE_BLACK_NUMBERS);

    // English Sans Bold Italic
    case 'style-sans-bold-italic':
    case 'sans-bold-italic':
      return mapEnglishCharacters(text, SANS_BOLD_ITALIC_UPPER, SANS_BOLD_ITALIC_LOWER, SANS_BOLD_ITALIC_NUMBERS);

    // English Double Struck / Blackboard
    case 'style-double-struck':
    case 'double-struck':
      return mapEnglishCharacters(text, DOUBLE_STRUCK_UPPER, DOUBLE_STRUCK_LOWER, DOUBLE_STRUCK_NUMBERS);

    // English Circled White
    case 'style-circle-white':
    case 'circle-white':
      return mapEnglishCharacters(text, CIRCLE_WHITE_UPPER, CIRCLE_WHITE_LOWER, CIRCLE_WHITE_NUMBERS);

    // Urdu Long Kashida (عبـــــداللہ)
    case 'style-urdu-kashida-long':
    case 'urdu-kashida-long':
      return applyUrduKashida(text, 5);

    // Urdu Single Tatweel (عـبـداللہ)
    case 'style-urdu-tatweel-single':
    case 'urdu-tatweel-single':
      return applyUrduSingleTatweel(text);

    // Urdu Spaced (ع ب د ا ل ل ہ / عبد  اللہ)
    case 'style-urdu-spaced':
    case 'urdu-spaced':
      return applyUrduLetterSpacing(text);

    default:
      return text;
  }
}

// Live typing character transformer (handles individual keystrokes in real time)
export function transformLiveChar(char: string, prevChar: string, styleId: string): string {
  if (!char || !styleId || !styleId.startsWith('style-')) return char;

  // Urdu live typing
  if (styleId === 'style-urdu-tatweel-single') {
    if (isArabicChar(char) && isArabicChar(prevChar) && !ARABIC_NON_CONNECTING.has(prevChar) && prevChar !== 'ـ') {
      return 'ـ' + char;
    }
    return char;
  }

  if (styleId === 'style-urdu-kashida-long') {
    if (isArabicChar(char) && isArabicChar(prevChar) && !ARABIC_NON_CONNECTING.has(prevChar) && prevChar !== 'ـ') {
      return 'ـــــ' + char;
    }
    return char;
  }

  if (styleId === 'style-urdu-spaced') {
    if (char !== ' ' && isArabicChar(char)) {
      return char + ' ';
    }
    return char;
  }

  // English Unicode styles
  return transformTextStyle(char, styleId);
}

// Available Styles List with Preview Samples
export const AVAILABLE_TEXT_STYLES: TextStyleOption[] = [
  // User explicitly requested English styles:
  {
    id: 'style-fraktur',
    name: 'Gothic Fraktur',
    urduName: 'گوگل و ونٹیج گوٹھک',
    sample: '𝔗𝔶𝔭𝔢 𝔰𝔬𝔪𝔢𝔱𝔥𝔦𝔫𝔤 𝔱𝔬 𝔰𝔱𝔞𝔯𝔱',
    type: 'english',
    category: '✨ Trendy English'
  },
  {
    id: 'style-script-bold',
    name: 'Bold Calligraphy Script',
    urduName: 'بولڈ کرسیو خطاطی',
    sample: '𝓣𝔂𝓹𝓮 𝓼𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝓽𝓸 𝓼𝓽𝔞𝔯𝓽',
    type: 'english',
    category: '✨ Trendy English'
  },
  {
    id: 'style-bubble-black',
    name: 'Black Bubble Badge',
    urduName: 'سیاہ گول ببل بیج',
    sample: '🅣🅨🅟🅔 🅢🅞🅜🅔🅣🅗🅘🅝🅖 🅣🅞 🅢🅣🅐🅡🅣',
    type: 'english',
    category: '✨ Trendy English'
  },
  {
    id: 'style-sans-bold-italic',
    name: 'Sans Bold Italic',
    urduName: 'بولڈ ترچھا ماڈرن',
    sample: '𝙏𝙮𝙥𝙚 𝙨𝙤𝙢𝙚𝙩𝙝𝙞𝙣𝙜 𝙩𝙤 𝙨𝙩𝙖𝙧𝙩',
    type: 'english',
    category: '✨ Trendy English'
  },
  {
    id: 'style-double-struck',
    name: 'Blackboard Double-Struck',
    urduName: 'ڈبل لائن میتھ اسٹائل',
    sample: '𝕋𝕪𝕡𝕖 𝕤𝕠𝕞𝕖𝕥𝕙𝕚𝕟𝕘 𝕥𝕠 𝕤𝕥𝕒𝕣𝕥',
    type: 'english',
    category: '✨ Trendy English'
  },
  {
    id: 'style-circle-white',
    name: 'Light Circled Bubble',
    urduName: 'سفید دائرہ دار حروف',
    sample: 'Ⓣⓨⓟⓔ ⓢⓞⓜⓔⓣⓗⓘⓝⓖ',
    type: 'english',
    category: '✨ Trendy English'
  },

  // User explicitly requested Urdu styles:
  {
    id: 'style-urdu-kashida-long',
    name: 'Urdu Kashida Long',
    urduName: 'اردو کشیدہ خطاطی (لمبی کشش)',
    sample: 'عبـــــداللہ',
    type: 'urdu',
    category: '🖋️ اردو خوشخطی و تزئین'
  },
  {
    id: 'style-urdu-tatweel-single',
    name: 'Urdu Newspaper Tatweel',
    urduName: 'اخباری سرخی کشیدہ (عـبـداللہ)',
    sample: 'عـبـداللہ',
    type: 'urdu',
    category: '🖋️ اردو خوشخطی و تزئین'
  },
  {
    id: 'style-urdu-spaced',
    name: 'Spaced Calligraphy',
    urduName: 'فاصلہ دار حروف (ع ب د ا ل ل ہ)',
    sample: 'ع ب د ا ل ل ہ',
    type: 'urdu',
    category: '🖋️ اردو خوشخطی و تزئین'
  }
];
