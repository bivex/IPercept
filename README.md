# IPercept

A photo guessing game. Random images are shown — type what you think it is.

## How it works

1. A random photo is fetched from the selected source
2. You see the image and type your guess
3. The answer is revealed — see if you were right
4. Your score is tracked across rounds

Guessing uses word overlap matching: if half or more words from the answer appear in your guess, it counts as correct. For Unsplash photos, matching any tag word also counts as correct.

## Sources

### Wikipedia

Random Wikipedia articles with thumbnails. Supports 10 language editions — the language dropdown is visible only when Wikipedia is selected.

English, Українська, Русский, Deutsch, Français, Español, Italiano, Polski, 日本語, 中文

### Unsplash

High-quality photos from Unsplash. Photos come with auto-generated tags — describe the scene, objects, or mood to match. Requires an API key (free tier: 50 requests/hour).

To set up:

1. Go to https://unsplash.com/developers
2. Create an application
3. Copy your Access Key
4. Create a `.env` file:

```
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
```

Note: Unsplash content (descriptions, tags) is always in English regardless of language settings.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Semantic UI CSS
- Wikipedia REST API
- Unsplash API

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Build

```bash
npm run build
```

## Project structure

```
src/
  main.tsx     — entry point, Semantic UI CSS import
  App.tsx      — UI layout (Semantic UI components)
  api.ts       — Wikipedia + Unsplash API clients, language/source lists
  useGame.ts   — game state hook (fetch, guess, score, skip)
  types.ts     — Photo, GameRound, GameState types
```
