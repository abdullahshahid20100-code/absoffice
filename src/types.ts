export interface AuthUser {
  name: string;
  username: string;
  email: string;
  profession?: string;
  avatarUrl?: string;
}

export type TemplateId = 'blank' | 'formal-letter' | 'poetry' | 'urdu-script' | 'exam-questions' | 'custom-size';

export interface DocumentTemplate {
  id: TemplateId;
  name: string;
  subtitle: string;
  description: string;
  cardBg: string;
  iconBg?: string;
  defaultTitle: string;
  defaultContent: string;
  defaultFont: string;
  defaultDirection: 'rtl' | 'ltr';
  defaultAlign: 'left' | 'center' | 'right' | 'justify';
  defaultLineHeight: string;
  hasBorder?: boolean;
}

export interface SavedDocument {
  id: string;
  title: string;
  content: string;
  templateId: TemplateId;
  fontFamily: string;
  fontSize: number;
  lineHeight: string;
  wordSpacing?: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  direction: 'rtl' | 'ltr';
  pageSize: string;
  viewMode?: 'single' | 'dual';
  deviceId?: string;
  updatedAt: number;
  wordCount: number;
  charCount: number;
}

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A5' | 'Custom';

export interface PageDimensions {
  width: string; // e.g. '210mm' or '794px'
  minHeight: string; // e.g. '297mm' or '1123px'
  name: string;
}
