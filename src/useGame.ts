import { useState, useCallback } from 'react';
import type { Photo, GameRound } from './types';
import { fetchRandomPhoto, LANGUAGES, type Source } from './api';

function checkGuess(guess: string, answer: string, tags: string[]): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
  const g = normalize(guess);
  const a = normalize(answer);

  if (!g) return false;
  if (g === a) return true;

  const guessWords = g.split(/\s+/);

  // For tagged photos (Unsplash), match any tag word in guess
  if (tags.length > 0) {
    const tagWords = tags.flatMap(t => normalize(t).split(/\s+/)).filter(Boolean);
    const matchedTags = tagWords.filter(tw => guessWords.includes(tw));
    if (matchedTags.length >= 1) return true;
  }

  // For Wikipedia-style titles, word overlap
  const answerWords = a.split(/\s+/);
  const overlap = answerWords.filter(w => guessWords.includes(w));
  return overlap.length >= Math.ceil(answerWords.length * 0.5);
}

export function useGame() {
  const [source, setSource] = useState<Source>('wikipedia');
  const [lang, setLang] = useState(LANGUAGES[0].code);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GameRound[]>([]);

  const loadNext = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRevealed(false);
    setCorrect(false);
    setGuess('');
    const seenIds = new Set(history.map(r => r.photo.id));
    if (photo) seenIds.add(photo.id);
    try {
      const p = await fetchRandomPhoto(source, lang, seenIds);
      setPhoto(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch photo');
    } finally {
      setLoading(false);
    }
  }, [source, lang, history, photo]);

  const changeSource = useCallback((s: Source) => {
    setSource(s);
    setScore(0);
    setTotal(0);
    setHistory([]);
  }, []);

  const changeLang = useCallback((newLang: string) => {
    setLang(newLang);
    setScore(0);
    setTotal(0);
    setHistory([]);
  }, []);

  const submitGuess = useCallback(() => {
    if (!photo || revealed) return;
    const isCorrect = checkGuess(guess, photo.title, photo.tags);
    setCorrect(isCorrect);
    setRevealed(true);
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setHistory(h => [
      ...h,
      { photo, userGuess: guess, revealed: true, correct: isCorrect },
    ]);
  }, [photo, guess, revealed]);

  const skip = useCallback(async () => {
    if (!photo || revealed) return;
    setTotal(t => t + 1);
    setHistory(h => [
      ...h,
      { photo, userGuess: '(skipped)', revealed: true, correct: false },
    ]);
    setRevealed(true);
    setCorrect(false);
    setGuess('');
    const seenIds = new Set([...history.map(r => r.photo.id), photo.id]);
    setLoading(true);
    try {
      const p = await fetchRandomPhoto(source, lang, seenIds);
      setPhoto(p);
      setRevealed(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch photo');
    } finally {
      setLoading(false);
    }
  }, [photo, revealed, history, source, lang]);

  return {
    source, changeSource,
    lang, changeLang,
    photo, guess, setGuess, revealed, correct,
    score, total, loading, error, history,
    loadNext, submitGuess, skip,
  };
}
