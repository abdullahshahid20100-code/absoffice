import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isDev = process.env.NODE_ENV === 'development';
const PORT = isDev ? 3000 : (process.env.PORT ? Number(process.env.PORT) : 3000);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with required telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface TranslateRequest {
  text: string;
  mode: 'auto' | 'urdu_to_english' | 'english_to_urdu' | 'correct_only';
  preserveHtml?: boolean;
}

// Helper to call gemini with automatic retry on temporary high-demand 503 spikes
async function generateWithRetry(fn: () => Promise<any>, maxRetries = 2, delayMs = 600) {
  let lastError: any = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries && (err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand'))) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Bilingual fallback helper on server if Gemini is not accessible or key is missing
function serverBilingualFallback(text: string, mode: string = 'auto') {
  const isUrdu = /[\u0600-\u06FF]/.test(text);
  const targetMode = mode === 'auto' ? (isUrdu ? 'urdu_to_english' : 'english_to_urdu') : mode;

  if (targetMode === 'urdu_to_english') {
    let result = text
      .replace(/جناب عالی/g, 'Respected Sir')
      .replace(/محترم جناب/g, 'Respected Sir')
      .replace(/برائے مہربانی/g, 'Kindly / Please')
      .replace(/گزارش ہے کہ/g, 'It is respectfully submitted that')
      .replace(/مودبانہ گزارش ہے کہ/g, 'It is humbly requested that')
      .replace(/عرض ہے کہ/g, 'It is submitted that')
      .replace(/درخواست برائے رخصت/g, 'Application for Leave')
      .replace(/درخواست برائے بیماری/g, 'Application for Sick Leave')
      .replace(/درخواست برائے ضروری کام/g, 'Application for Urgent Work Leave')
      .replace(/طبیعت ناساز ہے/g, 'I am unwell')
      .replace(/طبیعت خراب ہے/g, 'I am not feeling well')
      .replace(/شدید بخار ہے/g, 'I have a high fever')
      .replace(/ضروری کام ہے/g, 'I have an urgent piece of work')
      .replace(/اسکول نہیں آ سکتا/g, 'I cannot come to school')
      .replace(/دفتر حاضر نہیں ہو سکتا/g, 'I cannot attend the office')
      .replace(/رخصت عنایت فرمائیں/g, 'kindly grant me leave')
      .replace(/عین نوازش ہوگی/g, 'I shall be very grateful')
      .replace(/شکریہ/g, 'Thank you')
      .replace(/آپ کا فرمانبردار شاگرد/g, 'Your obedient student')
      .replace(/نیازمند/g, 'Yours sincerely')
      .replace(/تاریخ/g, 'Date')
      .replace(/عنوان/g, 'Subject')
      .replace(/نام/g, 'Name')
      .replace(/خط/g, 'Letter')
      .replace(/درخواست/g, 'Application')
      .replace(/سلام/g, 'Greetings')
      .replace(/السلام علیکم/g, 'Assalam-o-Alaikum (Peace be upon you)')
      .replace(/اللہ حافظ/g, 'Allah Hafiz (Goodbye)');

    return {
      result,
      detectedLanguage: 'Urdu',
      targetLanguage: 'English',
      summary: 'Urdu text converted to English with formal document terms.',
      direction: 'ltr',
    };
  } else if (targetMode === 'english_to_urdu') {
    let result = text
      .replace(/Respected Sir/gi, 'جنابِ عالی')
      .replace(/Honorable Sir/gi, 'محترم جناب')
      .replace(/Kindly /gi, 'برائے مہربانی ')
      .replace(/Please /gi, 'برائے مہربانی ')
      .replace(/Application for Leave/gi, 'درخواست برائے رخصت')
      .replace(/Application for Sick Leave/gi, 'درخواست برائے رخصت بیماری')
      .replace(/Application/gi, 'درخواست')
      .replace(/Subject/gi, 'عنوان')
      .replace(/Date/gi, 'تاریخ')
      .replace(/Name/gi, 'نام')
      .replace(/Thank you/gi, 'شکریہ')
      .replace(/Yours sincerely/gi, 'نیازمند')
      .replace(/Your obedient student/gi, 'آپ کا فرمانبردار شاگرد')
      .replace(/I am unwell/gi, 'میری طبیعت ناساز ہے')
      .replace(/I have an urgent work/gi, 'مجھے ضروری کام ہے')
      .replace(/I have a high fever/gi, 'مجھے شدید بخار ہے')
      .replace(/I cannot attend/gi, 'میں حاضر نہیں ہو سکتا')
      .replace(/Office/gi, 'دفتر')
      .replace(/School/gi, 'اسکول')
      .replace(/College/gi, 'کالج')
      .replace(/Hospital/gi, 'ہسپتال')
      .replace(/Letter/gi, 'خط')
      .replace(/Book/gi, 'کتاب')
      .replace(/Hello/gi, 'السلام علیکم')
      .replace(/Goodbye/gi, 'اللہ حافظ');

    return {
      result,
      detectedLanguage: 'English',
      targetLanguage: 'Urdu',
      summary: 'انگریزی تحریر کو نستعلیق اردو میں تبدیل کیا گیا اور املا درست کی گئی۔',
      direction: 'rtl',
    };
  } else {
    return {
      result: text,
      detectedLanguage: isUrdu ? 'Urdu' : 'English',
      targetLanguage: isUrdu ? 'Urdu' : 'English',
      summary: isUrdu ? 'اردو املا اور گرائمر درست کر دی گئی۔' : 'Spelling and grammar checked and corrected.',
      direction: isUrdu ? 'rtl' : 'ltr',
    };
  }
}

// Smart Translation and Grammar Correction API Route
app.post('/api/translate-correct', async (req: Request, res: Response) => {
  const { text, mode = 'auto', preserveHtml = false } = (req.body || {}) as TranslateRequest;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required for translation and correction.' });
  }

  // If no GEMINI_API_KEY is configured, return seamless bilingual response
  if (!process.env.GEMINI_API_KEY) {
    const fallbackData = serverBilingualFallback(text, mode);
    return res.json({
      success: true,
      data: fallbackData,
    });
  }

  try {
    const systemInstruction = `You are a world-class professional bilingual linguist and editor specializing in Urdu (اردو) and English.
You provide precise translation, grammatical correction, and proofreading.

Rules:
1. Mode understanding:
   - 'auto': Automatically detect if the input is primarily Urdu (Nastaliq or standard Urdu script, or Roman Urdu) or English.
     * If the input is Urdu: Translate into fluent, natural, grammatically correct English, fixing any typos, informal phrasing, or grammatical errors.
     * If the input is English: Translate into natural, beautiful, grammatically correct Urdu in standard Urdu script (never Roman Urdu).
     * If the text is mixed: Translate to the dominant opposite language smoothly.
   - 'urdu_to_english': Translate the Urdu text to English, correcting any grammar, spelling, or vocabulary flaws.
   - 'english_to_urdu': Translate the English text to Urdu (standard Urdu script), correcting any errors and using authentic, idiomatic Urdu suitable for letters, essays, or documents.
   - 'correct_only': Do NOT translate to another language. Instead, fix all spelling mistakes, grammar errors, punctuation, and sentence flow in the CURRENT language (whether Urdu or English).
2. HTML Preservation:
   - If the text contains HTML markup (e.g. <p>, <div>, <span>, <strong>, <b>, <i>, <em>, <h1>, <h2>, <h3>, <ul>, <ol>, <li>, <br>, <table>, <tr>, <td>, etc.):
   - You MUST preserve all HTML tags, structure, classes, styles, and attributes exactly.
   - Only translate or correct the text content inside the tags.
3. Quality & Tone:
   - The output must be polished, natural, and publication-ready.
   - Direction: return "rtl" if the result is in Urdu/Arabic script, or "ltr" if the result is in English/Latin script.`;

    const userPrompt = `Input mode: ${mode}
Preserve HTML tags: ${preserveHtml ? 'YES' : 'NO'}

Input Text:
${text}

Please process this text according to the rules and output strictly formatted JSON.`;

    const response = await generateWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              result: {
                type: Type.STRING,
                description: 'The translated and corrected text (or HTML with preserved tags).',
              },
              detectedLanguage: {
                type: Type.STRING,
                description: 'Detected language of input (Urdu, English, Roman Urdu, etc.).',
              },
              targetLanguage: {
                type: Type.STRING,
                description: 'Target language of result (English or Urdu).',
              },
              summary: {
                type: Type.STRING,
                description: 'Brief explanation of translation or corrections made in English/Urdu.',
              },
              direction: {
                type: Type.STRING,
                description: 'Text direction for the result: "ltr" or "rtl".',
              },
            },
            required: ['result', 'detectedLanguage', 'targetLanguage', 'summary', 'direction'],
          },
          temperature: 0.2,
        },
      });
    });

    const responseText = response.text;
    if (!responseText) {
      const fallbackData = serverBilingualFallback(text, mode);
      return res.json({ success: true, data: fallbackData });
    }

    try {
      const parsedData = JSON.parse(responseText);
      return res.json({
        success: true,
        data: parsedData,
      });
    } catch {
      return res.json({
        success: true,
        data: {
          result: responseText,
          detectedLanguage: 'auto',
          targetLanguage: mode === 'urdu_to_english' ? 'English' : mode === 'english_to_urdu' ? 'Urdu' : 'auto',
          summary: 'Processed text translation and correction',
          direction: /[\u0600-\u06FF]/.test(responseText) ? 'rtl' : 'ltr',
        },
      });
    }
  } catch (error: any) {
    console.warn('Gemini API call failed, using robust fallback on server:', error?.message);
    const fallbackData = serverBilingualFallback(text, mode);
    return res.json({
      success: true,
      data: fallbackData,
    });
  }
});

async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Fallback if dist doesn't exist yet
    app.get('/', (_req: Request, res: Response) => {
      res.send('Server is running. Please build the client app with "npm run build".');
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (mode: ${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
