export interface Photo {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  source: 'wikipedia' | 'unsplash';
}

export interface GameRound {
  photo: Photo;
  userGuess: string;
  revealed: boolean;
  correct: boolean;
}

export interface GameState {
  rounds: GameRound[];
  currentRound: number;
  score: number;
  loading: boolean;
  error: string | null;
}
