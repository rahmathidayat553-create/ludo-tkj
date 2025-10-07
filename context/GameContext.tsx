import React, { createContext, useState, useCallback } from 'react';
// Fix: Import PlayerColor as a value, not just a type
import type { GameState, Player, Piece, User, GameContextType } from '../types';
import { PieceState, UserRole, PlayerColor } from '../types';
import { PLAYER_COLORS, START_POSITIONS, HOME_ENTRANCE, SAFE_POSITIONS, HOME_PATH_START, FINISHED_POSITION } from '../constants';

export const GameContext = createContext<GameContextType | null>(null);

const initialGameState = (): GameState => {
  const players: Record<string, Player> = {};
  PLAYER_COLORS.forEach(color => {
    players[color] = {
      color: color,
      name: `Player ${color.charAt(0).toUpperCase() + color.slice(1)}`,
      pieces: Array.from({ length: 4 }, (_, i) => ({
        id: i,
        color: color,
        position: -1,
        state: PieceState.HOME,
      })),
    };
  });
  return {
    players: players as Record<PlayerColor, Player>,
    // Fix: Use enum member for type safety
    currentTurn: PlayerColor.RED,
    diceValue: null,
    isRolling: false,
    winner: null,
    message: 'Red player\'s turn. Roll the dice!',
  };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const login = (username: string, pass: string): boolean => {
    if (username === 'admin' && pass === 'password123') {
      setLoggedInUser({ username: 'admin', role: UserRole.ADMIN });
      return true;
    }
    const playerNum = parseInt(username.replace('pemain', ''), 10);
    if (!isNaN(playerNum) && playerNum >= 1 && playerNum <= 4 && pass === `pemain${playerNum}`) {
      const color = PLAYER_COLORS[playerNum-1];
      setLoggedInUser({ username, role: UserRole.PLAYER, color });
      return true;
    }
    return false;
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  const changeTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.winner) return prev;
      const currentIndex = PLAYER_COLORS.indexOf(prev.currentTurn);
      const nextTurn = PLAYER_COLORS[(currentIndex + 1) % PLAYER_COLORS.length];
      return { ...prev, currentTurn: nextTurn, diceValue: null, message: `${nextTurn.charAt(0).toUpperCase() + nextTurn.slice(1)}'s turn. Roll the dice!` };
    });
  }, []);

  const getMovablePieces = useCallback((playerColor: PlayerColor, diceValue: number): Piece[] => {
    const player = gameState.players[playerColor];
    if (!player) return [];
  
    return player.pieces.filter(p => {
      if (p.state === PieceState.FINISHED) return false;
      if (p.state === PieceState.HOME) return diceValue === 6;
      if (p.state === PieceState.ACTIVE) {
        const homeEntrance = HOME_ENTRANCE[p.color];
        const startPos = START_POSITIONS[p.color];
        const currentDist = (p.position + 52 - startPos) % 52;
        return currentDist + diceValue < 57;
      }
      return true;
    });
  }, [gameState.players]);

  const rollDice = () => {
    if (gameState.isRolling || gameState.winner) return;

    setGameState(prev => ({ ...prev, isRolling: true, diceValue: null }));

    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => ({ ...prev, isRolling: false, diceValue: value }));
      
      const movablePieces = getMovablePieces(gameState.currentTurn, value);

      if (movablePieces.length === 0) {
        setGameState(prev => ({...prev, message: `No moves for ${prev.currentTurn}. Switching turn.`}));
        setTimeout(() => changeTurn(), 1500);
      } else {
        setGameState(prev => ({...prev, message: `${prev.currentTurn}, move a piece.`}));
      }

    }, 1000);
  };
  
  const movePiece = (piece: Piece) => {
    const { diceValue, currentTurn, players } = gameState;
    if (!diceValue || piece.color !== currentTurn) return;

    const nextState = JSON.parse(JSON.stringify(gameState)) as GameState;
    const player = nextState.players[piece.color];
    const pieceToMove = player.pieces.find(p => p.id === piece.id);

    if (!pieceToMove) return;

    let turnContinues = diceValue === 6;

    if (pieceToMove.state === PieceState.HOME && diceValue === 6) {
        pieceToMove.state = PieceState.ACTIVE;
        pieceToMove.position = START_POSITIONS[piece.color];
    } else if (pieceToMove.state === PieceState.ACTIVE) {
        const homeEntrance = HOME_ENTRANCE[piece.color];
        const startPos = START_POSITIONS[piece.color];
        let newPos = pieceToMove.position;

        for (let i = 0; i < diceValue; i++) {
            if (newPos === homeEntrance) {
                newPos = HOME_PATH_START;
            } else if (newPos >= HOME_PATH_START) {
                newPos++;
            } else {
                newPos = (newPos + 1) % 52;
            }
        }

        const homePathEnd = HOME_PATH_START + 5;
        if(newPos > homePathEnd) {
             pieceToMove.state = PieceState.FINISHED;
             pieceToMove.position = FINISHED_POSITION;
             turnContinues = true;
        } else {
            pieceToMove.position = newPos;
        }
    }
    
    // Collision check
    if (pieceToMove.state === PieceState.ACTIVE && !SAFE_POSITIONS.includes(pieceToMove.position)) {
        Object.values(nextState.players).forEach(p => {
            if (p.color !== piece.color) {
                p.pieces.forEach(opponentPiece => {
                    if (opponentPiece.position === pieceToMove.position) {
                        opponentPiece.position = -1;
                        opponentPiece.state = PieceState.HOME;
                        turnContinues = true;
                    }
                });
            }
        });
    }

    // Check for winner
    const allFinished = player.pieces.every(p => p.state === PieceState.FINISHED);
    if (allFinished) {
      nextState.winner = piece.color;
      nextState.message = `${piece.color.toUpperCase()} wins the game!`;
    }

    nextState.diceValue = null;
    setGameState(nextState);

    if (!turnContinues && !nextState.winner) {
        changeTurn();
    } else if (!nextState.winner) {
        setGameState(prev => ({...prev, message: `${prev.currentTurn}'s turn. Roll again!`}));
    }
  };


  return (
    <GameContext.Provider value={{ gameState, loggedInUser, login, logout, rollDice, movePiece }}>
      {children}
    </GameContext.Provider>
  );
};