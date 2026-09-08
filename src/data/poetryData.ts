export interface PoetryItem {
  id: string;
  language: 'urdu' | 'english';
  poet: string;
  poetUrdu?: string;
  title?: string;
  titleUrdu?: string;
  category: string;
  categoryUrdu?: string;
  lines: string[];
  suggestedFont?: string;
}

export type PoetryLayoutStyle = 'classic-center' | 'two-column' | 'quoted-card' | 'stanza';

export const URDU_POETRY_COLLECTION: PoetryItem[] = [
  // --- علامہ اقبال ---
  {
    id: 'iqbal-khudi',
    language: 'urdu',
    poet: 'علامہ محمد اقبال',
    titleUrdu: 'خودی کا راز',
    category: 'Motivational',
    categoryUrdu: 'خودی و ولولہ',
    suggestedFont: 'font-nastaliq',
    lines: [
      'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے',
      'خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے'
    ]
  },
  {
    id: 'iqbal-shaheen',
    language: 'urdu',
    poet: 'علامہ محمد اقبال',
    titleUrdu: 'شاہین کا ترانہ',
    category: 'Motivational',
    categoryUrdu: 'شاہین و حوصلہ',
    suggestedFont: 'font-nastaliq',
    lines: [
      'نہیں تیرا نشیمن قصرِ سلطانی کے گنبد پر',
      'تو شاہیں ہے بسیرا کر پہاڑوں کی چٹانوں میں'
    ]
  },
  {
    id: 'iqbal-sitaron',
    language: 'urdu',
    poet: 'علامہ محمد اقبال',
    titleUrdu: 'سفرِ حیات',
    category: 'Philosophical',
    categoryUrdu: 'امید و کائنات',
    suggestedFont: 'font-nastaliq',
    lines: [
      'ستاروں سے آگے جہاں اور بھی ہیں',
      'ابھی عشق کے امتحاں اور بھی ہیں'
    ]
  },
  {
    id: 'iqbal-wafa',
    language: 'urdu',
    poet: 'علامہ محمد اقبال',
    titleUrdu: 'جوابِ شکوہ',
    category: 'Sufi',
    categoryUrdu: 'عشقِ رسولؐ',
    suggestedFont: 'font-nastaliq',
    lines: [
      'کی محمدؐ سے وفا تو نے تو ہم تیرے ہیں',
      'یہ جہاں چیز ہے کیا لوح و قلم تیرے ہیں'
    ]
  },

  // --- مرزا اسد اللہ خاں غالب ---
  {
    id: 'ghalib-dil-e-nadan',
    language: 'urdu',
    poet: 'مرزا اسد اللہ خاں غالب',
    titleUrdu: 'دلِ ناداں',
    category: 'Romantic',
    categoryUrdu: 'عشق و فلسفہ',
    suggestedFont: 'font-nastaliq',
    lines: [
      'دلِ ناداں تجھے ہوا کیا ہے',
      'آخر اس درد کی دوا کیا ہے'
    ]
  },
  {
    id: 'ghalib-hazaron',
    language: 'urdu',
    poet: 'مرزا اسد اللہ خاں غالب',
    titleUrdu: 'ہزاروں خواہشیں',
    category: 'Philosophical',
    categoryUrdu: 'فلسفہ و زندگی',
    suggestedFont: 'font-nastaliq',
    lines: [
      'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے',
      'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے'
    ]
  },
  {
    id: 'ghalib-bazecha',
    language: 'urdu',
    poet: 'مرزا اسد اللہ خاں غالب',
    titleUrdu: 'بازیچۂ اطفال',
    category: 'Philosophical',
    categoryUrdu: 'دنیا کی حقیقت',
    suggestedFont: 'font-nastaliq',
    lines: [
      'بازیچۂ اطفال ہے دنیا مرے آگے',
      'ہوتا ہے شب و روز تماشا مرے آگے'
    ]
  },
  {
    id: 'ghalib-na-tha-kuch',
    language: 'urdu',
    poet: 'مرزا اسد اللہ خاں غالب',
    titleUrdu: 'ہستی و نیستی',
    category: 'Philosophical',
    categoryUrdu: 'تصوف و وجود',
    suggestedFont: 'font-nastaliq',
    lines: [
      'نہ تھا کچھ تو خدا تھا کچھ نہ ہوتا تو خدا ہوتا',
      'ڈبویا مجھ کو ہونے نے نہ ہوتا میں تو کیا ہوتا'
    ]
  },

  // --- فیض احمد فیض ---
  {
    id: 'faiz-gulon-main',
    language: 'urdu',
    poet: 'فیض احمد فیض',
    titleUrdu: 'گلشن کا کاروبار',
    category: 'Romantic',
    categoryUrdu: 'رومانوی و بہار',
    suggestedFont: 'font-nastaliq',
    lines: [
      'گلوں میں رنگ بھرے بادِ نوبہار چلے',
      'چلے بھی آؤ کہ گلشن کا کاروبار چلے'
    ]
  },
  {
    id: 'faiz-pehle-si',
    language: 'urdu',
    poet: 'فیض احمد فیض',
    titleUrdu: 'مجھ سے پہلی سی محبت',
    category: 'Sad',
    categoryUrdu: 'درد و سچائی',
    suggestedFont: 'font-nastaliq',
    lines: [
      'مجھ سے پہلی سی محبت مری محبوب نہ مانگ',
      'میں نے سمجھا تھا کہ تو ہے تو درخشاں ہے حیات'
    ]
  },
  {
    id: 'faiz-hum-dekhenge',
    language: 'urdu',
    poet: 'فیض احمد فیض',
    titleUrdu: 'ہم دیکھیں گے',
    category: 'Motivational',
    categoryUrdu: 'امید و انقلاب',
    suggestedFont: 'font-nastaliq',
    lines: [
      'ہم دیکھیں گے، لازم ہے کہ ہم بھی دیکھیں گے',
      'وہ دن کہ جس کا وعدہ ہے، جو لوحِ ازل پہ لکھا ہے'
    ]
  },

  // --- جون ایلیا ---
  {
    id: 'jaun-be-dili',
    language: 'urdu',
    poet: 'جون ایلیا',
    titleUrdu: 'بے دلی',
    category: 'Sad',
    categoryUrdu: 'اداس دل',
    suggestedFont: 'font-nastaliq',
    lines: [
      'بے دلی کیا یوں ہی دن گزر جائیں گے',
      'صرف زندہ رہے ہم تو مر جائیں گے'
    ]
  },
  {
    id: 'jaun-chain',
    language: 'urdu',
    poet: 'جون ایلیا',
    titleUrdu: 'چین',
    category: 'Sad',
    categoryUrdu: 'اضطراب',
    suggestedFont: 'font-nastaliq',
    lines: [
      'یہ مجھے چین کیوں نہیں پڑتا',
      'ایک ہی شخص تھا جہاں میں کیا'
    ]
  },
  {
    id: 'jaun-khud-ko',
    language: 'urdu',
    poet: 'جون ایلیا',
    titleUrdu: 'ملال',
    category: 'Sad',
    categoryUrdu: 'تنہائی و حسرت',
    suggestedFont: 'font-nastaliq',
    lines: [
      'میں بھی بہت عجیب ہوں اتنا عجیب ہوں کہ بس',
      'خود کو تباہ کر لیا اور ملال بھی نہیں'
    ]
  },

  // --- احمد فراز ---
  {
    id: 'faraz-suna-hai',
    language: 'urdu',
    poet: 'احمد فراز',
    titleUrdu: 'سنا ہے لوگ اسے',
    category: 'Romantic',
    categoryUrdu: 'عشق و دید',
    suggestedFont: 'font-nastaliq',
    lines: [
      'سنا ہے لوگ اسے آنکھ بھر کے دیکھتے ہیں',
      'سو اس کے شہر میں کچھ دن قیام کر کے دیکھتے ہیں'
    ]
  },
  {
    id: 'faraz-ranjish',
    language: 'urdu',
    poet: 'احمد فراز',
    titleUrdu: 'رنجش ہی سہی',
    category: 'Romantic',
    categoryUrdu: 'شکوہ و محبت',
    suggestedFont: 'font-nastaliq',
    lines: [
      'رنجش ہی سہی دل ہی دکھانے کے لیے آ',
      'آ پھر سے مجھے چھوڑ کے جانے کے لیے آ'
    ]
  },

  // --- پروین شاکر ---
  {
    id: 'parveen-khushbu',
    language: 'urdu',
    poet: 'پروین شاکر',
    titleUrdu: 'خوشبو',
    category: 'Romantic',
    categoryUrdu: 'جذبات و احساس',
    suggestedFont: 'font-nastaliq',
    lines: [
      'وہ تو خوشبو ہے ہواؤں میں بکھر جائے گا',
      'مسئلہ پھول کا ہے پھول کدھر جائے گا'
    ]
  },
  {
    id: 'parveen-ku-ba-ku',
    language: 'urdu',
    poet: 'پروین شاکر',
    titleUrdu: 'پذیرائی',
    category: 'Romantic',
    categoryUrdu: 'محبت و چرچا',
    suggestedFont: 'font-nastaliq',
    lines: [
      'کو بہ کو پھیل گئی بات شناسائی کی',
      'اس نے خوشبو کی طرح میری پذیرائی کی'
    ]
  },

  // --- میر تقی میر ---
  {
    id: 'mir-patta-patta',
    language: 'urdu',
    poet: 'میر تقی میر',
    titleUrdu: 'پتہ پتہ بوٹا بوٹا',
    category: 'Romantic',
    categoryUrdu: 'کلاسیک غزل',
    suggestedFont: 'font-nastaliq',
    lines: [
      'پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے',
      'جانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے'
    ]
  },
  {
    id: 'mir-ulti-ho-gyin',
    language: 'urdu',
    poet: 'میر تقی میر',
    titleUrdu: 'بیماریِ دل',
    category: 'Sad',
    categoryUrdu: 'درد و حسرت',
    suggestedFont: 'font-nastaliq',
    lines: [
      'الٹی ہو گئیں سب تدبیریں کچھ نہ دوا نے کام کیا',
      'دیکھا اس بیماریِ دل نے آخر کام تمام کیا'
    ]
  }
];

export const ENGLISH_POETRY_COLLECTION: PoetryItem[] = [
  // --- William Shakespeare ---
  {
    id: 'shakes-sonnet18',
    language: 'english',
    poet: 'William Shakespeare',
    title: 'Sonnet 18',
    category: 'Love & Romance',
    suggestedFont: 'font-playfair',
    lines: [
      'Shall I compare thee to a summer’s day?',
      'Thou art more lovely and more temperate:',
      'Rough winds do shake the darling buds of May,',
      'And summer’s lease hath all too short a date.'
    ]
  },
  {
    id: 'shakes-stage',
    language: 'english',
    poet: 'William Shakespeare',
    title: 'All The World’s A Stage',
    category: 'Philosophy & Life',
    suggestedFont: 'font-cinzel',
    lines: [
      'All the world’s a stage,',
      'And all the men and women merely players;',
      'They have their exits and their entrances,',
      'And one man in his time plays many parts.'
    ]
  },

  // --- Robert Frost ---
  {
    id: 'frost-road',
    language: 'english',
    poet: 'Robert Frost',
    title: 'The Road Not Taken',
    category: 'Life & Destiny',
    suggestedFont: 'font-playfair',
    lines: [
      'Two roads diverged in a yellow wood,',
      'And sorry I could not travel both',
      'And be one traveler, long I stood',
      'And looked down one as far as I could.'
    ]
  },
  {
    id: 'frost-woods',
    language: 'english',
    poet: 'Robert Frost',
    title: 'Stopping by Woods on a Snowy Evening',
    category: 'Nature & Solitude',
    suggestedFont: 'font-playfair',
    lines: [
      'The woods are lovely, dark and deep,',
      'But I have promises to keep,',
      'And miles to go before I sleep,',
      'And miles to go before I sleep.'
    ]
  },

  // --- William Wordsworth ---
  {
    id: 'words-daffodils',
    language: 'english',
    poet: 'William Wordsworth',
    title: 'I Wandered Lonely as a Cloud',
    category: 'Nature & Peace',
    suggestedFont: 'font-playfair',
    lines: [
      'I wandered lonely as a cloud',
      'That floats on high o’er vales and hills,',
      'When all at once I saw a crowd,',
      'A host, of golden daffodils.'
    ]
  },

  // --- Emily Dickinson ---
  {
    id: 'dickinson-hope',
    language: 'english',
    poet: 'Emily Dickinson',
    title: 'Hope Is the Thing with Feathers',
    category: 'Hope & Inspiration',
    suggestedFont: 'font-great-vibes',
    lines: [
      '“Hope” is the thing with feathers -',
      'That perches in the soul -',
      'And sings the tune without the words -',
      'And never stops - at all -'
    ]
  },

  // --- John Keats ---
  {
    id: 'keats-beauty',
    language: 'english',
    poet: 'John Keats',
    title: 'Endymion',
    category: 'Art & Beauty',
    suggestedFont: 'font-playfair',
    lines: [
      'A thing of beauty is a joy for ever:',
      'Its loveliness increases; it will never',
      'Pass into nothingness; but still will keep',
      'A bower quiet for us, and a sleep full of sweet dreams.'
    ]
  },

  // --- Rumi ---
  {
    id: 'rumi-field',
    language: 'english',
    poet: 'Mawlana Jalaluddin Rumi',
    title: 'A Great Wagon',
    category: 'Sufi & Spirituality',
    suggestedFont: 'font-playfair',
    lines: [
      'Out beyond ideas of wrongdoing and rightdoing,',
      'there is a field. I’ll meet you there.',
      'When the soul lies down in that grass,',
      'the world is too full to talk about.'
    ]
  },
  {
    id: 'rumi-wound',
    language: 'english',
    poet: 'Mawlana Jalaluddin Rumi',
    title: 'The Light',
    category: 'Healing & Wisdom',
    suggestedFont: 'font-great-vibes',
    lines: [
      'The wound is the place',
      'where the Light enters you.'
    ]
  },

  // --- Percy Bysshe Shelley ---
  {
    id: 'shelley-ozymandias',
    language: 'english',
    poet: 'Percy Bysshe Shelley',
    title: 'Ozymandias',
    category: 'History & Time',
    suggestedFont: 'font-cinzel',
    lines: [
      '“My name is Ozymandias, King of Kings;',
      'Look on my Works, ye Mighty, and despair!”',
      'Nothing beside remains. Round the decay',
      'Of that colossal Wreck, boundless and bare.'
    ]
  },

  // --- Maya Angelou ---
  {
    id: 'angelou-rise',
    language: 'english',
    poet: 'Maya Angelou',
    title: 'Still I Rise',
    category: 'Courage & Power',
    suggestedFont: 'font-montserrat',
    lines: [
      'You may write me down in history',
      'With your bitter, twisted lies,',
      'You may trod me in the very dirt',
      'But still, like dust, I’ll rise.'
    ]
  }
];

export interface FormatPoetryOptions {
  title?: string;
  lines: string[];
  poet: string;
  language: 'urdu' | 'english';
  layoutStyle: PoetryLayoutStyle;
  fontClass?: string;
  textColor?: string;
  accentColor?: string;
}

/**
 * Formats a given poetry piece into clean, high-contrast, beautiful HTML
 * ready for direct insertion on the document canvas sheet.
 */
export function generatePoetryHtml(options: FormatPoetryOptions): string {
  const {
    title,
    lines,
    poet,
    language,
    layoutStyle,
    fontClass = language === 'urdu' ? 'font-nastaliq' : 'font-playfair',
    textColor = '#111111',
    accentColor = '#2563eb'
  } = options;

  const isUrdu = language === 'urdu';
  const textDir = isUrdu ? 'rtl' : 'ltr';
  const textAlign = isUrdu ? 'center' : 'center';

  const cleanTitle = title ? title.trim() : '';
  const cleanPoet = poet ? poet.trim() : '';
  const cleanLines = lines.map((l) => l.trim()).filter(Boolean);

  const titleHtml = cleanTitle
    ? `<h3 style="margin-bottom: 14px; font-weight: bold; font-size: 1.25rem; color: ${textColor}; text-align: center; letter-spacing: ${isUrdu ? '0' : '0.04em'};">${cleanTitle}</h3>`
    : '';

  const poetHtml = cleanPoet
    ? `<div style="margin-top: 14px; font-size: ${isUrdu ? '1.05rem' : '0.95rem'}; font-weight: 600; color: ${textColor}; opacity: 0.85; text-align: center;">${isUrdu ? `— ${cleanPoet}` : `— ${cleanPoet}`}</div>`
    : '';

  // 1. Classic Centered Poetry Block
  if (layoutStyle === 'classic-center') {
    const linesHtml = cleanLines
      .map(
        (line, idx) =>
          `<p style="font-size: ${isUrdu ? '1.25rem' : '1.15rem'}; line-height: ${isUrdu ? '2.1' : '1.8'}; color: ${textColor}; margin-bottom: ${idx % 2 === 1 ? '16px' : '4px'}; text-align: center;">${line}</p>`
      )
      .join('\n');

    return `
<div class="poetry-block-wrapper ${fontClass}" dir="${textDir}" data-poetry="true" style="margin: 24px auto; max-width: 92%; padding: 12px 16px; text-align: center;">
  ${titleHtml}
  <div style="margin-bottom: 12px; color: ${textColor}; opacity: 0.6; font-size: 0.9rem; text-align: center; user-select: none;">
    ${isUrdu ? '❦ ✦ ❦' : '✦ ✧ ✦'}
  </div>
  ${linesHtml}
  ${poetHtml}
  <div style="margin-top: 12px; color: ${textColor}; opacity: 0.6; font-size: 0.9rem; text-align: center; user-select: none;">
    ${isUrdu ? '❦ ✦ ❦' : '✦ ✧ ✦'}
  </div>
</div>
<p><br></p>
`.trim();
  }

  // 2. Side-by-Side Two-Column Urdu Couplet Format
  if (layoutStyle === 'two-column') {
    let coupltRowsHtml = '';
    for (let i = 0; i < cleanLines.length; i += 2) {
      const line1 = cleanLines[i] || '';
      const line2 = cleanLines[i + 1] || '';
      if (line2) {
        coupltRowsHtml += `
<div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; font-size: ${isUrdu ? '1.2rem' : '1.1rem'}; line-height: ${isUrdu ? '2.0' : '1.7'}; color: ${textColor};">
  <div style="flex: 1; text-align: ${isUrdu ? 'right' : 'left'}; font-weight: 500;">${line1}</div>
  <div style="color: ${textColor}; opacity: 0.4; font-size: 0.85rem; user-select: none;">${isUrdu ? '•••' : '•••'}</div>
  <div style="flex: 1; text-align: ${isUrdu ? 'left' : 'right'}; font-weight: 500;">${line2}</div>
</div>`;
      } else {
        coupltRowsHtml += `
<div style="text-align: center; margin-bottom: 14px; font-size: ${isUrdu ? '1.2rem' : '1.1rem'}; line-height: ${isUrdu ? '2.0' : '1.7'}; color: ${textColor}; font-weight: 500;">${line1}</div>`;
      }
    }

    return `
<div class="poetry-block-wrapper ${fontClass}" dir="${textDir}" data-poetry="true" style="margin: 24px auto; max-width: 95%; padding: 14px 20px; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1);">
  ${titleHtml}
  ${coupltRowsHtml}
  ${poetHtml}
</div>
<p><br></p>
`.trim();
  }

  // 3. Quoted Decorative Card
  if (layoutStyle === 'quoted-card') {
    const linesHtml = cleanLines
      .map(
        (line, idx) =>
          `<p style="font-size: ${isUrdu ? '1.25rem' : '1.15rem'}; line-height: ${isUrdu ? '2.1' : '1.8'}; color: ${textColor}; margin-bottom: ${idx % 2 === 1 ? '14px' : '4px'}; text-align: center;">${line}</p>`
      )
      .join('\n');

    return `
<div class="poetry-block-wrapper ${fontClass}" dir="${textDir}" data-poetry="true" style="margin: 24px auto; max-width: 90%; background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-align: center; position: relative;">
  <div style="font-size: 2rem; line-height: 1; color: ${textColor}; opacity: 0.25; margin-bottom: 4px; font-family: serif; user-select: none;">
    “
  </div>
  ${titleHtml}
  ${linesHtml}
  ${poetHtml}
</div>
<p><br></p>
`.trim();
  }

  // 4. Stanza / Freeform Poetry
  const stanzaLinesHtml = cleanLines
    .map(
      (line) =>
        `<p style="font-size: ${isUrdu ? '1.2rem' : '1.1rem'}; line-height: ${isUrdu ? '2.0' : '1.8'}; color: ${textColor}; margin-bottom: 6px; text-align: ${textAlign};">${line}</p>`
    )
    .join('\n');

  return `
<div class="poetry-block-wrapper ${fontClass}" dir="${textDir}" data-poetry="true" style="margin: 20px auto; max-width: 88%; padding: 12px 16px;">
  ${titleHtml}
  ${stanzaLinesHtml}
  ${poetHtml}
</div>
<p><br></p>
`.trim();
}
