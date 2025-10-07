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
  [PlayerColor.RED]: 50,
  [PlayerColor.GREEN]: 11,
  [PlayerColor.YELLOW]: 24,
  [PlayerColor.BLUE]: 37,
};

export const HOME_PATH_START = 52;
export const FINISHED_POSITION = 100;

export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// This maps a piece's logical position to a grid cell for rendering
export const BOARD_LAYOUT: { [key: number]: { row: number; col: number } } = {
  // Path for Red (and others)
  0: { row: 7, col: 2 }, 1: { row: 7, col: 3 }, 2: { row: 7, col: 4 }, 3: { row: 7, col: 5 }, 4: { row: 7, col: 6 },
  5: { row: 6, col: 7 }, 6: { row: 5, col: 7 }, 7: { row: 4, col: 7 }, 8: { row: 3, col: 7 }, 9: { row: 2, col: 7 },
  10: { row: 2, col: 8 }, 11: { row: 2, col: 9 },
  12: { row: 3, col: 9 }, 13: { row: 4, col: 9 }, 14: { row: 5, col: 9 }, 15: { row: 6, col: 9 }, 16: { row: 7, col: 9 },
  17: { row: 7, col: 10 }, 18: { row: 7, col: 11 }, 19: { row: 7, col: 12 }, 20: { row: 7, col: 13 }, 21: { row: 7, col: 14 },
  22: { row: 8, col: 14 }, 23: { row: 9, col: 14 },
  24: { row: 9, col: 13 }, 25: { row: 9, col: 12 }, 26: { row: 9, col: 11 }, 27: { row: 9, col: 10 }, 28: { row: 9, col: 9 },
  29: { row: 10, col: 9 }, 30: { row: 11, col: 9 }, 31: { row: 12, col: 9 }, 32: { row: 13, col: 9 }, 33: { row: 14, col: 9 },
  34: { row: 14, col: 8 }, 35: { row: 14, col: 7 },
  36: { row: 13, col: 7 }, 37: { row: 12, col: 7 }, 38: { row: 11, col: 7 }, 39: { row: 10, col: 7 }, 40: { row: 9, col: 7 },
  41: { row: 9, col: 6 }, 42: { row: 9, col: 5 }, 43: { row: 9, col: 4 }, 44: { row: 9, col: 3 }, 45: { row: 9, col: 2 },
  46: { row: 8, col: 2 }, 47: { row: 7, col: 2 },
  48: { row: 8, col: 3 }, 49: { row: 8, col: 4 }, 50: { row: 8, col: 5 }, 51: { row: 8, col: 6 },
  
  // Red Home Path
  52: { row: 8, col: 3 }, 53: { row: 8, col: 4 }, 54: { row: 8, col: 5 }, 55: { row: 8, col: 6 }, 56: { row: 8, col: 7 }, 57: { row: 8, col: 8 },
  // Green Home Path
  58: { row: 3, col: 8 }, 59: { row: 4, col: 8 }, 60: { row: 5, col: 8 }, 61: { row: 6, col: 8 }, 62: { row: 7, col: 8 }, 63: { row: 8, col: 8 },
  // Yellow Home Path
  64: { row: 8, col: 13 }, 65: { row: 8, col: 12 }, 66: { row: 8, col: 11 }, 67: { row: 8, col: 10 }, 68: { row: 8, col: 9 }, 69: { row: 8, col: 8 },
  // Blue Home Path
  70: { row: 13, col: 8 }, 71: { row: 12, col: 8 }, 72: { row: 11, col: 8 }, 73: { row: 10, col: 8 }, 74: { row: 9, col: 8 }, 75: { row: 8, col: 8 },
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