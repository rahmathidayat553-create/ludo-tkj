import { PlayerColor } from './types';

// Fix: Use PlayerColor enum members instead of string literals
export const PLAYER_COLORS: PlayerColor[] = [PlayerColor.RED, PlayerColor.GREEN, PlayerColor.YELLOW, PlayerColor.BLUE];

// Fix: Use computed property names with enum members for type safety
export const START_POSITIONS: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 0,
  [PlayerColor.GREEN]: 13,
  [PlayerColor.YELLOW]: 26,
  [PlayerColor.BLUE]: 39,
};

// Fix: Use computed property names with enum members for type safety
export const HOME_ENTRANCE: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 51,
  [PlayerColor.GREEN]: 12,
  [PlayerColor.YELLOW]: 25,
  [PlayerColor.BLUE]: 38,
};

export const HOME_PATH_START = 52;
export const FINISHED_POSITION = 100;

export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// This maps a piece's logical position to a grid cell for rendering
export const BOARD_LAYOUT: { [key: number]: { row: number; col: number } } = {
  // Red's arm leading to the top
  0: { row: 7, col: 2 }, 1: { row: 7, col: 3 }, 2: { row: 7, col: 4 }, 3: { row: 7, col: 5 }, 4: { row: 7, col: 6 },
  5: { row: 6, col: 7 }, 6: { row: 5, col: 7 }, 7: { row: 4, col: 7 }, 8: { row: 3, col: 7 }, 9: { row: 2, col: 7 }, 10: { row: 1, col: 7 },
  // Top horizontal path
  11: { row: 1, col: 8 },
  // Green's arm leading to the right
  12: { row: 1, col: 9 }, 13: { row: 2, col: 9 }, 14: { row: 3, col: 9 }, 15: { row: 4, col: 9 }, 16: { row: 5, col: 9 }, 17: { row: 6, col: 9 },
  18: { row: 7, col: 10 }, 19: { row: 7, col: 11 }, 20: { row: 7, col: 12 }, 21: { row: 7, col: 13 }, 22: { row: 7, col: 14 }, 23: { row: 7, col: 15 },
  // Right vertical path
  24: { row: 8, col: 15 },
  // Yellow's arm leading to the bottom
  25: { row: 9, col: 15 }, 26: { row: 9, col: 14 }, 27: { row: 9, col: 13 }, 28: { row: 9, col: 12 }, 29: { row: 9, col: 11 }, 30: { row: 9, col: 10 },
  31: { row: 10, col: 9 }, 32: { row: 11, col: 9 }, 33: { row: 12, col: 9 }, 34: { row: 13, col: 9 }, 35: { row: 14, col: 9 }, 36: { row: 15, col: 9 },
  // Bottom horizontal path
  37: { row: 15, col: 8 },
  // Blue's arm leading to the left
  38: { row: 15, col: 7 }, 39: { row: 14, col: 7 }, 40: { row: 13, col: 7 }, 41: { row: 12, col: 7 }, 42: { row: 11, col: 7 }, 43: { row: 10, col: 7 },
  44: { row: 9, col: 6 }, 45: { row: 9, col: 5 }, 46: { row: 9, col: 4 }, 47: { row: 9, col: 3 }, 48: { row: 9, col: 2 }, 49: { row: 9, col: 1 },
  // Left vertical path
  50: { row: 8, col: 1 },
  51: { row: 7, col: 1 },
};

// Fix: Use computed property names with enum members for type safety
export const PLAYER_AREA_LAYOUT: Record<PlayerColor, { base: string, homePieces: { top: string, left: string }[] }> = {
    [PlayerColor.RED]: {
        base: 'row-start-1 col-start-1 row-span-6 col-span-6 bg-red-800/50',
        homePieces: [
            { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
            { top: '75%', left: '25%' }, { top: '75%', left: '75%' },
        ]
    },
    [PlayerColor.GREEN]: {
        base: 'row-start-1 col-start-10 row-span-6 col-span-6 bg-green-800/50',
        homePieces: [
            { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
            { top: '75%', left: '25%' }, { top: '75%', left: '75%' },
        ]
    },
    [PlayerColor.BLUE]: {
        base: 'row-start-10 col-start-1 row-span-6 col-span-6 bg-blue-800/50',
        homePieces: [
            { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
            { top: '75%', left: '25%' }, { top: '75%', left: '75%' },
        ]
    },
    [PlayerColor.YELLOW]: {
        base: 'row-start-10 col-start-10 row-span-6 col-span-6 bg-yellow-800/50',
        homePieces: [
            { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
            { top: '75%', left: '25%' }, { top: '75%', left: '75%' },
        ]
    },
};