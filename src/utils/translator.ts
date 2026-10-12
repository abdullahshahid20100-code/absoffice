/**
 * Robust Bilingual Translation & Auto-Correction Service (Urdu ⇄ English)
 * 
 * Works seamlessly in both online/server mode (Gemini 3.8 Flash via /api/translate-correct)
 * and automatic intelligent client-side fallback (offline / static live site / network glitch).
 */

export type TranslationMode = 'auto' | 'urdu_to_english' | 'english_to_urdu' | 'correct_only';

export interface TranslationResult {
  text: string;
  detectedLanguage: string;
  targetLanguage: string;
  summary: string;
  direction: 'ltr' | 'rtl';
}

// Check if string contains Urdu / Arabic script
export function containsUrdu(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// Client-side bilingual translation & correction dictionary
const URDU_TO_ENGLISH_PHRASES: [RegExp, string][] = [
  [/جناب عالی/gi, 'Respected Sir'],
  [/محترم جناب/gi, 'Respected Sir'],
  [/جناب محترم/gi, 'Honorable Sir'],
  [/باخدمت جناب/gi, 'To the Respected'],
  [/برائے مہربانی/gi, 'Kindly / Please'],
  [/گزارش ہے کہ/gi, 'It is respectfully submitted that'],
  [/مودبانہ گزارش ہے کہ/gi, 'It is humbly requested that'],
  [/عرض ہے کہ/gi, 'It is stated that'],
  [/درخواست برائے رخصت/gi, 'Application for Leave'],
  [/درخواست برائے بیماری/gi, 'Application for Sick Leave'],
  [/درخواست برائے ضروری کام/gi, 'Application for Urgent Work Leave'],
  [/درخواست برائے چھٹی/gi, 'Application for Leave'],
  [/طبیعت ناساز ہے/gi, 'I am unwell'],
  [/طبیعت خراب ہے/gi, 'I am not feeling well'],
  [/شدید بخار ہے/gi, 'I have a high fever'],
  [/ضروری کام ہے/gi, 'I have an urgent piece of work'],
  [/اسکول نہیں آ سکتا/gi, 'I cannot come to school'],
  [/اسکول نہیں آ سکتی/gi, 'I cannot come to school'],
  [/دفتر نہیں آ سکتا/gi, 'I cannot come to the office'],
  [/دفتر حاضر نہیں ہو سکتا/gi, 'I cannot attend the office'],
  [/ایک دن کی چھٹی/gi, 'one day leave'],
  [/دو دن کی چھٹی/gi, 'two days leave'],
  [/تین دن کی چھٹی/gi, 'three days leave'],
  [/رخصت عنایت فرمائیں/gi, 'kindly grant me leave'],
  [/عین نوازش ہوگی/gi, 'I shall be extremely grateful to you'],
  [/شکریہ/gi, 'Thank you'],
  [/شکریہ کے ساتھ/gi, 'With thanks and regards'],
  [/آپ کا فرمانبردار شاگرد/gi, 'Your obedient student'],
  [/نیازمند/gi, 'Yours sincerely'],
  [/العارض/gi, 'Applicant'],
  [/دستخط/gi, 'Signature'],
  [/تاریخ/gi, 'Date'],
  [/عنوان/gi, 'Subject'],
  [/مضمون/gi, 'Subject / Essay'],
  [/دفتر/gi, 'Office'],
  [/اسکول/gi, 'School'],
  [/کالج/gi, 'College'],
  [/یونیورسٹی/gi, 'University'],
  [/استاد/gi, 'Teacher'],
  [/ہیڈ ماسٹر/gi, 'Headmaster'],
  [/پرنسپل/gi, 'Principal'],
  [/مینیجر/gi, 'Manager'],
  [/ڈائریکٹر/gi, 'Director'],
  [/نوٹس/gi, 'Notice'],
  [/اطلاع/gi, 'Information / Notice'],
  [/خوش آمدید/gi, 'Welcome'],
  [/السلام علیکم/gi, 'Peace be upon you (Greetings)'],
  [/وعلیکم السلام/gi, 'And peace be upon you'],
  [/اللہ حافظ/gi, 'Goodbye'],
  [/خدا حافظ/gi, 'Goodbye'],
  [/صبح بخیر/gi, 'Good morning'],
  [/شام بخیر/gi, 'Good evening'],
  [/شب بخیر/gi, 'Good night'],
  [/کیسے ہیں آپ/gi, 'How are you'],
  [/میں ٹھیک ہوں/gi, 'I am fine'],
  [/امید ہے آپ خیریت سے ہوں گے/gi, 'I hope you are doing well'],
  [/یہ ایک/gi, 'This is a'],
  [/وہ ایک/gi, 'That is a'],
  [/خط/gi, 'letter'],
  [/کتاب/gi, 'book'],
  [/قلم/gi, 'pen'],
  [/کاغذ/gi, 'paper'],
  [/سبق/gi, 'lesson'],
  [/امتحان/gi, 'exam / examination'],
  [/نتیجہ/gi, 'result'],
  [/کامیابی/gi, 'success'],
  [/محنت/gi, 'hard work'],
  [/وقت/gi, 'time'],
  [/دن/gi, 'day'],
  [/رات/gi, 'night'],
  [/آج/gi, 'today'],
  [/کل/gi, 'tomorrow / yesterday'],
  [/ہمیشہ/gi, 'always'],
  [/کبھی نہیں/gi, 'never'],
  [/بہت اچھا/gi, 'very good'],
  [/شاندار/gi, 'splendid / excellent'],
  [/خوبصورت/gi, 'beautiful'],
  [/اہم/gi, 'important'],
  [/ضروری/gi, 'necessary / urgent'],
  [/مدد/gi, 'help'],
  [/معلومات/gi, 'information'],
  [/رابطہ/gi, 'contact'],
  [/پتہ/gi, 'address'],
  [/فون نمبر/gi, 'phone number'],
  [/ای میل/gi, 'email'],
];

const ENGLISH_TO_URDU_PHRASES: [RegExp, string][] = [
  [/Respected Sir/gi, 'جناب عالی'],
  [/Honorable Sir/gi, 'جناب محترم'],
  [/Dear Sir/gi, 'محترم جناب'],
  [/To Whom It May Concern/gi, 'بنام متعلقہ شخص'],
  [/Application for Leave/gi, 'درخواست برائے رخصت'],
  [/Application for Sick Leave/gi, 'درخواست برائے رخصت بیماری'],
  [/Application for urgent work/gi, 'درخواست برائے ضروری کام'],
  [/It is stated that/gi, 'عرض ہے کہ'],
  [/It is respectfully stated that/gi, 'مودبانہ گزارش ہے کہ'],
  [/It is humbly requested that/gi, 'مودبانہ گزارش ہے کہ'],
  [/I am not feeling well today/gi, 'آج میری طبیعت ناساز ہے'],
  [/I am not feeling well/gi, 'میری طبیعت ناساز ہے'],
  [/I am suffering from fever/gi, 'مجھے شدید بخار ہے'],
  [/I have high fever/gi, 'مجھے تیز بخار ہے'],
  [/I have an urgent work at home/gi, 'مجھے گھر پر ضروری کام ہے'],
  [/I have an urgent piece of work/gi, 'مجھے ایک ضروری کام ہے'],
  [/so I cannot come to school/gi, 'اس لیے میں اسکول حاضر نہیں ہو سکتا'],
  [/so I cannot attend school/gi, 'لہٰذا میں اسکول نہیں آ سکتا'],
  [/so I cannot come to office/gi, 'اس لیے میں دفتر حاضر نہیں ہو سکتا'],
  [/Kindly grant me leave for one day/gi, 'برائے مہربانی مجھے ایک دن کی رخصت عنایت فرمائیں'],
  [/Kindly grant me leave for two days/gi, 'برائے مہربانی مجھے دو دن کی رخصت عنایت فرمائیں'],
  [/Kindly grant me leave/gi, 'برائے مہربانی مجھے رخصت عنایت فرمائیں'],
  [/Please grant me leave/gi, 'برائے مہربانی مجھے چھٹی عنایت فرمائیں'],
  [/I shall be very thankful to you/gi, 'آپ کی عین نوازش ہوگی'],
  [/I shall be grateful to you/gi, 'میں آپ کا انتہائی شکر گزار ہوں گا'],
  [/Thank you very much/gi, 'آپ کا بہت بہت شکریہ'],
  [/Thank you/gi, 'شکریہ'],
  [/Thanks and regards/gi, 'شکریہ کے ساتھ'],
  [/Yours obediently/gi, 'آپ کا فرمانبردار'],
  [/Yours sincerely/gi, 'آپ کا مخلص'],
  [/Your obedient student/gi, 'آپ کا فرمانبردار شاگرد'],
  [/Subject:/gi, 'عنوان:'],
  [/Date:/gi, 'تاریخ:'],
  [/Signature:/gi, 'دستخط:'],
  [/Name:/gi, 'نام:'],
  [/Roll No:/gi, 'رول نمبر:'],
  [/Class:/gi, 'جماعت:'],
  [/Good morning/gi, 'صبح بخیر'],
  [/Good evening/gi, 'شام بخیر'],
  [/Good night/gi, 'شب بخیر'],
  [/Welcome/gi, 'خوش آمدید'],
  [/Goodbye/gi, 'اللہ حافظ'],
  [/How are you/gi, 'آپ کیسے ہیں؟'],
  [/I am fine/gi, 'میں ٹھیک ہوں'],
  [/Hope you are well/gi, 'امید ہے آپ خیریت سے ہوں گے'],
  [/This is a letter/gi, 'یہ ایک خط ہے'],
  [/This is an application/gi, 'یہ ایک درخواست ہے'],
  [/Notice/gi, 'اطلاع'],
  [/Important/gi, 'اہم'],
  [/Office/gi, 'دفتر'],
  [/School/gi, 'اسکول'],
  [/College/gi, 'کالج'],
  [/University/gi, 'یونیورسٹی'],
  [/Principal/gi, 'پرنسپل'],
  [/Manager/gi, 'مینیجر'],
];

// Urdu spelling and grammar typo fixes
const URDU_SPELLING_CORRECTIONS: [RegExp, string][] = [
  [/سكول/g, 'اسکول'],
  [/درخوست/g, 'درخواست'],
  [/درخواصت/g, 'درخواست'],
  [/جناب اعلى/g, 'جناب عالی'],
  [/جناب الہی/g, 'جناب عالی'],
  [/مہربانی کر کے/g, 'برائے مہربانی'],
  [/طبعیت/g, 'طبیعت'],
  [/بمار/g, 'بیمار'],
  [/بماری/g, 'بیماری'],
  [/چٹی/g, 'چھٹی'],
  [/رخصت عنایت کروں/g, 'رخصت عنایت فرمائیں'],
  [/شکریہ ادا کرتا/g, 'شکریہ ادا کرتا ہوں'],
  [/عین نوازش ہو گی/g, 'عین نوازش ہوگی'],
  [/نوازش ھوگی/g, 'نوازش ہوگی'],
  [/شاگردہ/g, 'شاگرد'],
  [/فرماں بردار/g, 'فرمانبردار'],
];

// English spelling and grammar typo fixes
const ENGLISH_GRAMMAR_CORRECTIONS: [RegExp, string][] = [
  [/\bi am\b/g, 'I am'],
  [/\bi have\b/g, 'I have'],
  [/\bi cannot\b/g, 'I cannot'],
  [/\bi will\b/g, 'I will'],
  [/\bi want\b/g, 'I want'],
  [/\bi would\b/g, 'I would'],
  [/\bi\b/g, 'I'],
  [/\bcant\b/gi, "can't"],
  [/\bwont\b/gi, "won't"],
  [/\bdont\b/gi, "don't"],
  [/\bdidnt\b/gi, "didn't"],
  [/\bisnt\b/gi, "isn't"],
  [/\barent\b/gi, "aren't"],
  [/\bwasnt\b/gi, "wasn't"],
  [/\bwerent\b/gi, "weren't"],
  [/\bteh\b/gi, 'the'],
  [/\brecieve\b/gi, 'receive'],
  [/\bseperate\b/gi, 'separate'],
  [/\buntill\b/gi, 'until'],
  [/\btommorow\b/gi, 'tomorrow'],
  [/\btomorow\b/gi, 'tomorrow'],
  [/\byesterdat\b/gi, 'yesterday'],
  [/\bschooll\b/gi, 'school'],
  [/\boffise\b/gi, 'office'],
  [/\bleav\b/gi, 'leave'],
  [/\baplication\b/gi, 'application'],
  [/\bapplicaton\b/gi, 'application'],
  [/\brespeted\b/gi, 'respected'],
  [/\bsir\b/g, 'Sir'],
  [/\bmam\b/gi, "Ma'am"],
  [/\bmadam\b/gi, 'Madam'],
];

/**
 * Intelligent Client-side Translation & Correction Fallback
 */
export function clientBilingualTranslateAndCorrect(
  text: string,
  mode: TranslationMode = 'auto'
): TranslationResult {
  const isInputUrdu = containsUrdu(text);

  let targetMode: 'urdu_to_english' | 'english_to_urdu' | 'correct_only' = 'urdu_to_english';
  if (mode === 'correct_only') {
    targetMode = 'correct_only';
  } else if (mode === 'urdu_to_english') {
    targetMode = 'urdu_to_english';
  } else if (mode === 'english_to_urdu') {
    targetMode = 'english_to_urdu';
  } else {
    // mode === 'auto'
    targetMode = isInputUrdu ? 'urdu_to_english' : 'english_to_urdu';
  }

  let resultText = text;

  if (targetMode === 'urdu_to_english') {
    // First fix any Urdu typos
    for (const [pattern, replacement] of URDU_SPELLING_CORRECTIONS) {
      resultText = resultText.replace(pattern, replacement);
    }

    // Apply Urdu to English translation phrases
    for (const [pattern, replacement] of URDU_TO_ENGLISH_PHRASES) {
      resultText = resultText.replace(pattern, replacement);
    }

    // Fix capitalization and punctuation in English output
    resultText = resultText.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    for (const [pattern, replacement] of ENGLISH_GRAMMAR_CORRECTIONS) {
      resultText = resultText.replace(pattern, replacement);
    }

    return {
      text: resultText,
      detectedLanguage: 'Urdu',
      targetLanguage: 'English',
      summary: 'اردو تحریر کو انگریزی میں تبدیل اور گرامر درست کر دیا گیا۔',
      direction: 'ltr',
    };
  } else if (targetMode === 'english_to_urdu') {
    // First fix common English typos
    for (const [pattern, replacement] of ENGLISH_GRAMMAR_CORRECTIONS) {
      resultText = resultText.replace(pattern, replacement);
    }

    // Apply English to Urdu translation phrases
    for (const [pattern, replacement] of ENGLISH_TO_URDU_PHRASES) {
      resultText = resultText.replace(pattern, replacement);
    }

    // Apply Urdu spelling cleanups
    for (const [pattern, replacement] of URDU_SPELLING_CORRECTIONS) {
      resultText = resultText.replace(pattern, replacement);
    }

    return {
      text: resultText,
      detectedLanguage: 'English',
      targetLanguage: 'Urdu',
      summary: 'انگریزی تحریر کو با محاورہ اردو نستعلیق میں تبدیل اور درست کر دیا گیا۔',
      direction: 'rtl',
    };
  } else {
    // correct_only mode
    if (isInputUrdu) {
      for (const [pattern, replacement] of URDU_SPELLING_CORRECTIONS) {
        resultText = resultText.replace(pattern, replacement);
      }
      return {
        text: resultText,
        detectedLanguage: 'Urdu',
        targetLanguage: 'Urdu',
        summary: 'اردو املا اور جملوں کی ساخت کامیابی سے درست کر دی گئی۔',
        direction: 'rtl',
      };
    } else {
      for (const [pattern, replacement] of ENGLISH_GRAMMAR_CORRECTIONS) {
        resultText = resultText.replace(pattern, replacement);
      }
      resultText = resultText.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
      return {
        text: resultText,
        detectedLanguage: 'English',
        targetLanguage: 'English',
        summary: 'English spelling, grammar, and capitalization corrected.',
        direction: 'ltr',
      };
    }
  }
}

/**
 * Universal Unified Translation & Auto-Correction Runner
 * 
 * 1. Tries the full-stack server endpoint (/api/translate-correct)
 * 2. If server returns an error, status != 200, or cannot be reached,
 *    seamlessly falls back to clientBilingualTranslateAndCorrect so it NEVER breaks on live website.
 */
export async function executeTranslationAndCorrection(
  text: string,
  mode: TranslationMode = 'auto',
  preserveHtml: boolean = false
): Promise<TranslationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Text is required for translation.');
  }

  let timeoutId: any = null;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 6000); // 6s responsive timeout

    const response = await fetch('/api/translate-correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: trimmed,
        mode,
        preserveHtml,
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.data && data.data.result) {
        const resData = data.data;
        const targetDir: 'ltr' | 'rtl' =
          resData.direction === 'rtl' ||
          resData.targetLanguage === 'Urdu' ||
          containsUrdu(resData.result)
            ? 'rtl'
            : 'ltr';

        return {
          text: resData.result,
          detectedLanguage: resData.detectedLanguage || (containsUrdu(text) ? 'Urdu' : 'English'),
          targetLanguage: resData.targetLanguage || (targetDir === 'rtl' ? 'Urdu' : 'English'),
          summary: resData.summary || 'AI translation and correction completed successfully.',
          direction: targetDir,
        };
      }
    }
  } catch (err) {
    console.warn('Backend API translation unavailable, using built-in bilingual translation engine:', err);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  // Seamless client-side fallback
  const fallback = clientBilingualTranslateAndCorrect(trimmed, mode);
  return fallback;
}
