# IPercept

A photo guessing game. Random Wikipedia images are shown — type what you think it is.

## How it works

1. A random Wikipedia article with an image is fetched
2. You see the image and type your guess
3. The answer is revealed — see if you were right
4. Your score is tracked across rounds

Guessing uses word overlap matching: if half or more words from the answer appear in your guess, it counts as correct.

## Languages

Pick a Wikipedia language edition from the dropdown. Score resets on language change.

English, Українська, Русский, Deutsch, Français, Español, Italiano, Polski, 日本語, 中文

## Tech stack

- React 19 + TypeScript
- Vite 6
- Semantic UI CSS
- Wikipedia REST API (`/api/rest_v1/page/random/summary`)

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
  api.ts       — Wikipedia API client + language list
  useGame.ts   — game state hook (fetch, guess, score, skip)
  types.ts     — Photo, GameRound, GameState types
```
