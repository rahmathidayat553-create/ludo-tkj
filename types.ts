
export enum PlayerColor {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

export enum PieceState {
  HOME = 'home',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export interface Piece {
  id: number;
  color: PlayerColor;
  position: number; // -1 for home, 0-51 for track, 52-57 for home run, 100 for finished
  state: PieceState;
}

export interface Player {
  color: PlayerColor;
  name: string;
  pieces: Piece[];
}

export interface GameState {
  players: Record<PlayerColor, Player>;
  currentTurn: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  winner: PlayerColor | null;
  message: string;
}

export enum UserRole {
    PLAYER = 'player',
    ADMIN = 'admin'
}

export interface User {
    username: string;
    role: UserRole;
    color?: PlayerColor;
}

export interface GameContextType {
  gameState: GameState;
  loggedInUser: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  rollDice: () => void;
  movePiece: (piece: Piece) => void;
}
