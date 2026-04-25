import type { Photo } from './types';

interface WikipediaResponse {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  pageid: number;
}

export interface LangOption {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: LangOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export async function fetchRandomPhoto(lang: string): Promise<Photo> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data: WikipediaResponse = await res.json();

  if (!data.thumbnail?.source) {
    return fetchRandomPhoto(lang);
  }

  return {
    id: String(data.pageid),
    imageUrl: data.thumbnail.source,
    title: data.title,
    description: data.extract,
  };
}
