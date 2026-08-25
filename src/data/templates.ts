import { DocumentTemplate } from '../types';

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'urdu-script',
    name: 'Urdu Script / Screenplay',
    subtitle: 'Suspense & Thriller Style',
    description: 'Specialized layout for Urdu films, drama scripts, dialogue pacing, and suspense scene headers.',
    cardBg: 'bg-[#fef3c7]', // Warm yellow pastel
    iconBg: 'bg-[#fde68a]',
    defaultTitle: 'منظر نامہ (Urdu Screenplay)',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'right',
    defaultLineHeight: '2.2',
    hasBorder: false,
    defaultContent: `
<h2 style="text-align: center; color: #1e3a8a; font-weight: bold; margin-bottom: 20px;">منظر نامہ: رات کا سناٹا (منظر ۱)</h2>

<p style="font-weight: bold; color: #475569; margin-bottom: 10px;">
  <strong>مقام:</strong> پرانا حویلی کا برآمدہ &nbsp;|&nbsp; <strong>وقت:</strong> نصف شب &nbsp;|&nbsp; <strong>کیفیت:</strong> تیز بارش اور بادلوں کی گرج
</p>

<p style="margin-bottom: 16px; color: #334155;">
  (کیمرہ دھیمے دھیمے دروازے کی طرف بڑھتا ہے۔ ہوا کے تیز جھونکے سے لکڑی کا دروازہ ہلکی چرچراہٹ کے ساتھ خود بخود کھلتا ہے۔ دانیال ہاتھ میں ٹارچ لیے اندر داخل ہوتا ہے۔)
</p>

<p style="text-align: center; font-weight: bold; color: #0f172a; margin-top: 14px; margin-bottom: 4px;">
  دانیال
</p>
<p style="text-align: center; margin-bottom: 16px; max-width: 80%; margin-left: auto; margin-right: auto;">
  (گھبرائی ہوئی آواز میں) کوئی ہے یہاں؟ میں جانتا ہوں تم یہیں چھپے ہو!
</p>

<p style="margin-bottom: 16px; color: #334155;">
  (کونے سے ایک سائے کی جھلک گزرتی ہے۔ گھڑی کے بارہ بجنے کی آواز گونج اٹھتی ہے۔)
</p>
`
  },
  {
    id: 'formal-letter',
    name: 'Formal Letter / App',
    subtitle: 'With clean frame',
    description: 'Official correspondence, job applications, petitions, and institutional Urdu & English notices.',
    cardBg: 'bg-[#ede9fe]', // Soft lilac pastel
    iconBg: 'bg-[#ddd6fe]',
    defaultTitle: 'درخواست / Formal Application',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'right',
    defaultLineHeight: '2.0',
    hasBorder: true,
    defaultContent: `
<p><strong>بخدمت جناب عالی،</strong></p>
<p>چیف ایگزیکٹو آفیسر،</p>
<p>ادارہ قومی ترقیات، اسلام آباد۔</p>

<p style="background: #f8fafc; padding: 8px 14px; border-right: 4px solid #2563eb; margin: 16px 0;">
  <strong>عنوان: </strong>درخواست برائے فراہمی دفتری سہولیات و این او سی
</p>

<p style="margin-bottom: 14px;"><strong>جناب عالی!</strong></p>

<p style="text-indent: 30px; margin-bottom: 14px; text-align: justify;">
  نہایت ادب اور احترام کے ساتھ گزارش ہے کہ سائل پچھلے دو سال سے ادارے کے شعبہ آئی ٹی میں بطور سینئر ڈویلپر خدمات سرانجام دے رہا ہے۔ نئے تعلیمی پراجیکٹ کے سلسلے میں متعلقہ دستاویزات اور محکمانہ اجازت نامہ درکار ہے۔
</p>

<p style="text-indent: 30px; margin-bottom: 24px; text-align: justify;">
  امید ہے کہ آپ میری اس مخلصانہ درخواست پر ہمدردانہ غور فرماتے ہوئے جلد از جلد این او سی جاری کرنے کے احکامات صادر فرمائیں گے۔ آپ کی اس نوازش کے لیے تہہ دل سے مشکور رہوں گا۔
</p>

<p style="margin-top: 30px;">
  <strong>العارض:</strong> محمد عبداللہ شاہد<br>
  تاریخ: ۲۴ اگست ۲۰۲۶ء
</p>
`
  },
  {
    id: 'blank',
    name: 'Blank Document',
    subtitle: 'A4 Size with border',
    description: 'A clean, high-precision blank canvas with standard A4 margins, ready for freeform Urdu or English typing.',
    cardBg: 'bg-[#ffe4e6]', // Soft coral/peach pastel
    iconBg: 'bg-[#fecdd3]',
    defaultTitle: 'Blank Document',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'right',
    defaultLineHeight: '2.0',
    hasBorder: false,
    defaultContent: `
<p style="font-size: 1.25rem; color: #1e293b; text-align: center;">بسم اللہ الرحمٰن الرحیم</p>
<p><br></p>
<p>یہاں سے اپنی تحریر کا آغاز کیجیے...</p>
`
  },
  {
    id: 'poetry',
    name: 'Poetry & Ghazal',
    subtitle: 'Center-focused alignment',
    description: 'Aesthetic symmetric layout tailored for Urdu Ghazals, Nazms, couplets (ash\'aar), and literary compositions.',
    cardBg: 'bg-[#e0e7ff]', // Soft lavender pastel
    iconBg: 'bg-[#c7d2fe]',
    defaultTitle: 'انتخاب کلام و غزل',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'center',
    defaultLineHeight: '2.4',
    hasBorder: false,
    defaultContent: `
<h2 style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a; margin-bottom: 24px; text-align: center;">غزلِ غالب</h2>

<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 6px; text-align: center;">دلِ ناداں تجھے ہوا کیا ہے</p>
<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 20px; text-align: center;">آخر اس درد کی دوا کیا ہے</p>

<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 6px; text-align: center;">ہم ہیں مشتاق اور وہ بیزار</p>
<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 20px; text-align: center;">یا الٰہی یہ ماجرا کیا ہے</p>

<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 6px; text-align: center;">میں بھی منہ میں زبان رکھتا ہوں</p>
<p style="font-size: 1.2rem; color: #0f172a; margin-bottom: 20px; text-align: center;">کاش پوچھو کہ مدعا کیا ہے</p>

<p style="margin-top: 20px; font-weight: 500; color: #64748b; text-align: center;">
  — مرزا اسد اللہ خاں غالب
</p>
`
  },
  {
    id: 'exam-questions',
    name: 'Exam / Question Paper (پرچہ امتحانی)',
    subtitle: 'MCQs & Subjective Questions',
    description: 'Formatted Urdu school/college examination paper layout with objective MCQs, short and long questions.',
    cardBg: 'bg-[#dcfce7]', // Soft green pastel
    iconBg: 'bg-[#bbf7d0]',
    defaultTitle: 'سالانہ امتحانی پرچہ - اردو لازمی',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'right',
    defaultLineHeight: '2.2',
    hasBorder: false,
    defaultContent: `
<h2 style="font-size: 1.4rem; font-weight: bold; color: #0f172a; margin-bottom: 4px; text-align: center;">گورنمنٹ ماڈل ہائر سیکنڈری اسکول</h2>
<h3 style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; text-align: center; margin-bottom: 12px;">سالانہ امتحان ۲۰۲۶ء — پرچہ: اردو (لازمی)</h3>

<p style="font-weight: bold; color: #1e3a8a; font-size: 1.1rem; margin-bottom: 8px;">حصہ اول: معروضی سوالات (MCQs) — [نمبر: ۱۵]</p>
<p style="margin-bottom: 6px;"><strong>سوال نمبر ۱:</strong> درست جواب کے گرد دائرہ لگائیے۔</p>

<p style="margin-right: 15px; margin-bottom: 8px;">۱. مرزا غالب کس شہر میں پیدا ہوئے؟</p>
<p style="color: #334155; margin-right: 25px; margin-bottom: 14px;">(الف) دہلی &nbsp;&nbsp;&nbsp;&nbsp; (ب) آگرہ &nbsp;&nbsp;&nbsp;&nbsp; (ج) لکھنؤ &nbsp;&nbsp;&nbsp;&nbsp; (د) لاہور</p>

<p style="margin-right: 15px; margin-bottom: 8px;">۲. 'دستِ صبا' کس نامور شاعر کا شعری مجموعہ ہے؟</p>
<p style="color: #334155; margin-right: 25px; margin-bottom: 16px;">(الف) علامہ اقبال &nbsp;&nbsp;&nbsp;&nbsp; (ب) فیض احمد فیض &nbsp;&nbsp;&nbsp;&nbsp; (ج) احمد فراز &nbsp;&nbsp;&nbsp;&nbsp; (د) حبیب جالب</p>

<p style="font-weight: bold; color: #1e3a8a; font-size: 1.1rem; margin-bottom: 8px;">حصہ دوم: مختصر سوالات کے جوابات — [نمبر: ۳۰]</p>
<p style="margin-bottom: 6px;"><strong>سوال نمبر ۲:</strong> درج ذیل میں سے کوئی سے پانچ سوالات کے مختصر جوابات تحریر کیجیے:</p>
<p style="margin-bottom: 4px; margin-right: 15px;">۱. سبق 'مرزا غالب کے عادات و خصائل' کے مصنف کا نام بتائیے۔</p>
<p style="margin-bottom: 4px; margin-right: 15px;">۲. تشبیہ کے کتنے ارکان ہیں؟ نام لکھیے۔</p>
<p style="margin-bottom: 4px; margin-right: 15px;">۳. قومی ترانے کے خالق کا مختصر تعارف پیش کیجیے۔</p>
<p style="margin-bottom: 4px; margin-right: 15px;">۴. صنعتِ تضاد کی تعریف بمع ایک مثال تحریر کیجیے۔</p>

<p style="font-weight: bold; color: #1e3a8a; font-size: 1.1rem; margin-top: 14px; margin-bottom: 8px;">حصہ سوم: تفصیلی سوالات — [نمبر: ۳۰]</p>
<p style="margin-bottom: 6px;"><strong>سوال نمبر ۳:</strong> درج ذیل اشعار کی تشریح بمع حوالہ تحریر فرمائیے:</p>
<p style="text-align: center; background: #f8fafc; padding: 10px; border-right: 3px solid #0284c7; margin: 8px 0;">نہ تھا کچھ تو خدا تھا کچھ نہ ہوتا تو خدا ہوتا<br>ڈبویا مجھ کو ہونے نے نہ ہوتا میں تو کیا ہوتا</p>
`
  },
  {
    id: 'custom-size',
    name: 'Custom Size',
    subtitle: 'Define your own dimensions',
    description: 'Customize page width, height, margins, and orientation for book covers, brochures, and flyers.',
    cardBg: 'bg-[#cffafe]', // Soft cyan pastel
    iconBg: 'bg-[#a5f3fc]',
    defaultTitle: 'Custom Document',
    defaultFont: 'font-nastaliq',
    defaultDirection: 'rtl',
    defaultAlign: 'right',
    defaultLineHeight: '2.0',
    hasBorder: false,
    defaultContent: `
<h2 style="text-align: center; color: #0891b2; font-weight: bold; margin-bottom: 18px;">اپنی مرضی کا سائز اور صفحہ</h2>
<p>یہ دستاویز حسبِ ضرورت سائز پر تشکیل دی گئی ہے۔ آپ ٹول بار سے پیج سائز اورینٹیشن اور حاشیے بھی تبدیل کر سکتے ہیں۔</p>
`
  }
];

export const INITIAL_SAVED_DOCS = [
  {
    id: 'doc-1',
    title: 'منظر نامہ: رات کا سناٹا',
    content: TEMPLATES[0].defaultContent,
    templateId: 'urdu-script' as const,
    fontFamily: 'font-nastaliq',
    fontSize: 16,
    lineHeight: '2.2',
    textAlign: 'right' as const,
    direction: 'rtl' as const,
    pageSize: 'A4',
    updatedAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    wordCount: 88,
    charCount: 420
  },
  {
    id: 'doc-2',
    title: 'درخواست برائے این او سی',
    content: TEMPLATES[1].defaultContent,
    templateId: 'formal-letter' as const,
    fontFamily: 'font-nastaliq',
    fontSize: 16,
    lineHeight: '2.0',
    textAlign: 'right' as const,
    direction: 'rtl' as const,
    pageSize: 'A4',
    updatedAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    wordCount: 95,
    charCount: 470
  },
  {
    id: 'doc-3',
    title: 'غزلِ غالب - دیوان',
    content: TEMPLATES[3].defaultContent,
    templateId: 'poetry' as const,
    fontFamily: 'font-nastaliq',
    fontSize: 18,
    lineHeight: '2.5',
    textAlign: 'center' as const,
    direction: 'rtl' as const,
    pageSize: 'A4',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    wordCount: 42,
    charCount: 180
  }
];
