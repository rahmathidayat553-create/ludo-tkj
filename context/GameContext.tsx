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
      name: `Pemain ${color.charAt(0).toUpperCase() + color.slice(1)}`,
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
    message: 'Giliran pemain Merah. Kocok dadu!',
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
      const nextPlayerName = nextTurn.charAt(0).toUpperCase() + nextTurn.slice(1);
      return { ...prev, currentTurn: nextTurn, diceValue: null, message: `Giliran pemain ${nextPlayerName}. Kocok dadu!` };
    });
  }, []);

  const getMovablePieces = useCallback((playerColor: PlayerColor, diceValue: number): Piece[] => {
    const player = gameState.players[playerColor];
    if (!player) return [];
  
    return player.pieces.filter(p => {
      if (p.state === PieceState.FINISHED) return false;
      if (p.state === PieceState.HOME) return diceValue === 6;
      
      if (p.state === PieceState.ACTIVE) {
        let tempPos = p.position;
        const homeEntrance = HOME_ENTRANCE[p.color];
        let enteredHomeRun = tempPos >= HOME_PATH_START;

        for (let i = 0; i < diceValue; i++) {
            if (!enteredHomeRun && tempPos === homeEntrance) {
                tempPos = HOME_PATH_START;
                enteredHomeRun = true;
            } else if (enteredHomeRun) {
                tempPos++;
            } else {
                tempPos = (tempPos + 1) % 52;
            }
        }
        
        const homeRunFinishPosition = HOME_PATH_START + 6;
        // A move is valid if it doesn't overshoot the final home position
        return tempPos <= homeRunFinishPosition;
      }
      return false;
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
        setGameState(prev => ({...prev, message: `Tidak ada gerakan untuk ${prev.currentTurn}. Ganti giliran.`}));
        setTimeout(() => changeTurn(), 1500);
      } else {
        setGameState(prev => ({...prev, message: `${prev.currentTurn}, gerakkan pion.`}));
      }

    }, 1000);
  };
  
  const movePiece = (piece: Piece) => {
    const { diceValue, currentTurn } = gameState;

    // Basic validation: must be a dice roll, must be the current player's piece
    if (!diceValue || piece.color !== currentTurn) return;

    // Create a deep copy of the state to mutate safely
    const nextState = JSON.parse(JSON.stringify(gameState)) as GameState;
    const player = nextState.players[piece.color];
    const pieceToMove = player.pieces.find(p => p.id === piece.id);

    if (!pieceToMove) return;

    // A turn continues if the player rolls a 6, captures a piece, or finishes a piece.
    let turnContinues = diceValue === 6;

    // 1. Handle moving a piece out of HOME
    if (pieceToMove.state === PieceState.HOME && diceValue === 6) {
        pieceToMove.state = PieceState.ACTIVE;
        pieceToMove.position = START_POSITIONS[piece.color];
    } 
    // 2. Handle moving an ACTIVE piece
    else if (pieceToMove.state === PieceState.ACTIVE) {
        const homeEntrance = HOME_ENTRANCE[piece.color];
        let newPos = pieceToMove.position;
        let enteredHomeRun = newPos >= HOME_PATH_START;

        // Calculate new position step-by-step to handle home-run transition
        for (let i = 0; i < diceValue; i++) {
            if (!enteredHomeRun && newPos === homeEntrance) {
                newPos = HOME_PATH_START;
                enteredHomeRun = true;
            } else if (enteredHomeRun) {
                newPos++;
            } else {
                newPos = (newPos + 1) % 52;
            }
        }
        
        const homeRunFinishPosition = HOME_PATH_START + 6; // The position that signifies a piece has finished the home run
        if (newPos === homeRunFinishPosition) {
            pieceToMove.state = PieceState.FINISHED;
            pieceToMove.position = FINISHED_POSITION;
            turnContinues = true; // Finishing a piece grants another turn
        } else {
            // The move is only valid if it doesn't overshoot the home run.
            // This logic is handled by `getMovablePieces`, so we assume the move is valid.
            pieceToMove.position = newPos;
        }
    }

    // 3. Collision Detection (only for active pieces on the main board)
    if (pieceToMove.state === PieceState.ACTIVE && pieceToMove.position < HOME_PATH_START && !SAFE_POSITIONS.includes(pieceToMove.position)) {
        Object.values(nextState.players).forEach(otherPlayer => {
            if (otherPlayer.color !== piece.color) {
                otherPlayer.pieces.forEach(opponentPiece => {
                    if (opponentPiece.position === pieceToMove.position) {
                        opponentPiece.position = -1; // Send back to home
                        opponentPiece.state = PieceState.HOME;
                        turnContinues = true; // Capturing a piece grants another turn
                    }
                });
            }
        });
    }

    // 4. Check for a winner
    const allPiecesFinished = player.pieces.every(p => p.state === PieceState.FINISHED);
    if (allPiecesFinished) {
      nextState.winner = piece.color;
      nextState.message = `${piece.color.toUpperCase()} memenangkan permainan!`;
    }

    // Reset dice value for the next action
    nextState.diceValue = null;

    // Update the game state with all the changes
    setGameState(nextState);

    // 5. Determine the next action (change turn or roll again)
    if (nextState.winner) {
        return; // Game over, no more turns
    }

    if (turnContinues) {
        setGameState(prev => ({...prev, message: `Giliran ${prev.currentTurn}. Kocok lagi!`}));
    } else {
        changeTurn();
    }
  };


  return (
    <GameContext.Provider value={{ gameState, loggedInUser, login, logout, rollDice, movePiece }}>
      {children}
    </GameContext.Provider>
  );
};