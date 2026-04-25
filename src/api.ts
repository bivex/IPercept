import type { Photo } from './types';

// ── Wikipedia ──────────────────────────────────────────────

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

async function fetchWikipedia(lang: string, excludeIds: Set<string>, retries = 5): Promise<Photo> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);

  const data: WikipediaResponse = await res.json();
  if (!data.thumbnail?.source) return fetchWikipedia(lang, excludeIds, retries);

  const id = `wiki-${data.pageid}`;
  if (excludeIds.has(id) && retries > 0) {
    return fetchWikipedia(lang, excludeIds, retries - 1);
  }

  return {
    id,
    imageUrl: data.thumbnail.source,
    title: data.title,
    description: data.extract,
    tags: [],
    source: 'wikipedia',
  };
}

// ── Unsplash ───────────────────────────────────────────────

interface UnsplashTag {
  title: string;
}

interface UnsplashResponse {
  id: string;
  urls: { regular: string };
  alt_description: string | null;
  description: string | null;
  tags?: UnsplashTag[];
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

async function fetchUnsplash(excludeIds: Set<string>, retries = 5): Promise<Photo> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash API key not set. Add VITE_UNSPLASH_ACCESS_KEY to .env');
  }

  const url = `https://api.unsplash.com/photos/random?orientation=landscape&count=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Unsplash rate limit exceeded (50/hour on free tier). Wait a moment or switch to Wikipedia.');
    throw new Error(`Unsplash API error: ${res.status}`);
  }

  const [data]: [UnsplashResponse] = await res.json();
  const id = `unsplash-${data.id}`;

  if (excludeIds.has(id) && retries > 0) {
    return fetchUnsplash(excludeIds, retries - 1);
  }

  const tags = (data.tags ?? []).map(t => t.title.toLowerCase());
  const title = data.alt_description ?? data.description ?? tags[0] ?? 'Unknown';

  return {
    id,
    imageUrl: data.urls.regular,
    title,
    description: data.description ?? data.alt_description ?? '',
    tags,
    source: 'unsplash',
  };
}

// ── Unified fetch ──────────────────────────────────────────

export type Source = 'wikipedia' | 'unsplash';

export interface SourceOption {
  id: Source;
  label: string;
  icon: string;
}

export const SOURCES: SourceOption[] = [
  { id: 'wikipedia', label: 'Wikipedia', icon: 'book' },
  { id: 'unsplash', label: 'Unsplash', icon: 'camera' },
];

export async function fetchRandomPhoto(source: Source, lang: string, excludeIds: Set<string>): Promise<Photo> {
  if (source === 'unsplash') return fetchUnsplash(excludeIds);
  return fetchWikipedia(lang, excludeIds);
}
