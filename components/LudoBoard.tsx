import React, { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameContext';
import Piece from './Piece';
import { BOARD_LAYOUT, PLAYER_AREA_LAYOUT, HOME_ENTRANCE, START_POSITIONS, HOME_PATH_START } from '../constants';
import { GameContextType, Piece as PieceType, PlayerColor } from '../types';

const LudoBoard: React.FC = () => {
    const { gameState, movePiece, loggedInUser } = useContext(GameContext) as GameContextType;
    const { players, currentTurn, diceValue, animatedPiece } = gameState;

    const movablePieces = useMemo(() => {
        if (!diceValue || currentTurn !== loggedInUser?.color) return new Set();

        const player = players[currentTurn];
        if (!player) return new Set();

        const movables = player.pieces.filter(p => {
            if (p.state === 'finished') return false;
            if (p.state === 'home') return diceValue === 6;
            if (p.state === 'active') {
                const homeEntrance = HOME_ENTRANCE[p.color];
                let entersHome = false;
                let tempPos = p.position;
                for (let i = 0; i < diceValue; i++) {
                    if (tempPos === homeEntrance) {
                        entersHome = true;
                        break;
                    }
                    tempPos = (tempPos + 1) % 52;
                }
                if(entersHome) {
                     const distToEntrance = (homeEntrance + 52 - p.position) % 52;
                     return (diceValue - distToEntrance) <= 6;
                }
                return true;
            }
            return false;
        });

        return new Set(movables.map(p => `${p.color}-${p.id}`));
    }, [diceValue, currentTurn, players, loggedInUser]);
    
    const renderCell = (row: number, col: number) => {
        const key = `${row}-${col}`;
        let bgColor = 'bg-gray-900'; // Default for cells outside the path
        let isStar = false;
        
        // Color the main path cross shape
        const isPath = (row >= 7 && row <= 9) || (col >= 7 && col <= 9);
        if (isPath) {
            bgColor = 'bg-gray-800/60';
        }

        // Color home paths
        if (row === 8 && col >= 2 && col <= 7) bgColor = 'bg-red-500/70';      // Red home path
        if (col === 8 && row >= 2 && row <= 7) bgColor = 'bg-green-500/70';    // Green home path
        if (row === 8 && col >= 9 && col <= 14) bgColor = 'bg-yellow-500/70';  // Yellow home path
        if (col === 8 && row >= 9 && row <= 14) bgColor = 'bg-blue-500/70';    // Blue home path
        
        // Mark start cells (they are also safe cells with stars)
        if (row === 7 && col === 2) { bgColor = 'bg-red-500/70'; isStar = true; }   // Red start (pos 0)
        if (row === 2 && col === 9) { bgColor = 'bg-green-500/70'; isStar = true; } // Green start (pos 13)
        if (row === 9 && col === 14) { bgColor = 'bg-yellow-500/70'; isStar = true; } // Yellow start (pos 26)
        if (row === 14 && col === 7) { bgColor = 'bg-blue-500/70'; isStar = true; } // Blue start (pos 39)
        
        // Mark other safe cells with stars
        if ((row === 3 && col === 7) ||   // pos 8
            (row === 7 && col === 13) ||  // pos 21
            (row === 13 && col === 9) ||  // pos 34
            (row === 9 && col === 3)      // pos 47
        ) {
             isStar = true;
        }

        return <div key={key} className={`w-full h-full border border-gray-600/50 ${bgColor} flex items-center justify-center`}>{isStar && <span className="text-xl text-gray-400">★</span>}</div>;
    };

    const getHomeRunPosition = (piece: PieceType) => {
        const offset = piece.position - HOME_PATH_START; // offset is 0-5
        if (offset < 0 || offset > 5) return null; 

        switch(piece.color) {
            case PlayerColor.RED:    return { row: 8, col: 2 + offset };
            case PlayerColor.GREEN:  return { row: 2 + offset, col: 8 };
            case PlayerColor.YELLOW: return { row: 8, col: 14 - offset };
            case PlayerColor.BLUE:   return { row: 14 - offset, col: 8 };
            default: return null;
        }
    }
    
    return (
        <div className="relative w-[90vw] h-[90vw] sm:w-[70vh] sm:h-[70vh] max-w-[600px] max-h-[600px] bg-gray-900 grid grid-cols-15 grid-rows-15 p-2 rounded-md shadow-2xl">
            {/* Base grid */}
            {Array.from({ length: 15*15 }).map((_, i) => renderCell(Math.floor(i / 15) + 1, (i % 15) + 1))}
            
            {/* Player areas */}
            {Object.entries(PLAYER_AREA_LAYOUT).map(([color, layout]) => (
                <div key={color} className={`absolute inset-0 grid ${layout.base} border-4 border-gray-600`}>
                    <div className="relative m-auto w-2/3 h-2/3 bg-gray-800 rounded-lg shadow-inner">
                        {players[color as PlayerColor].pieces.filter(p => p.state === 'home').map((piece) => (
                             <Piece 
                                key={piece.id} 
                                piece={piece} 
                                onClick={() => movePiece(piece)} 
                                isMovable={movablePieces.has(`${piece.color}-${piece.id}`)}
                                style={{
                                    top: `calc(${layout.homePieces[piece.id].top} - 12.5%)`,
                                    left: `calc(${layout.homePieces[piece.id].left} - 12.5%)`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
            
            {/* Center home triangle */}
            <div className="absolute grid-center col-start-7 row-start-7 col-span-3 row-span-3">
                 <div className="w-full h-full relative">
                    {/* Fix: Cast style object to React.CSSProperties to allow CSS custom properties */}
                    <div className="absolute top-0 left-0 w-0 h-0 border-l-[50%] border-r-[50%] border-b-[100%] border-solid border-l-transparent border-r-transparent border-b-red-600" style={{borderLeftWidth: 'calc(var(--w)/2)', borderRightWidth: 'calc(var(--w)/2)', borderBottomWidth: 'var(--h)', width: '100%', height:'50%', '--w': '100%', '--h': '50%'} as React.CSSProperties}></div>
                    {/* Fix: Cast style object to React.CSSProperties to allow CSS custom properties */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[50%] border-b-[50%] border-l-[100%] border-solid border-t-transparent border-b-transparent border-l-green-600" style={{borderTopWidth: 'calc(var(--h)/2)', borderBottomWidth: 'calc(var(--h)/2)', borderLeftWidth: 'var(--w)', width: '50%', height:'100%', '--w': '50%', '--h': '100%'} as React.CSSProperties}></div>
                    {/* Fix: Cast style object to React.CSSProperties to allow CSS custom properties */}
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[50%] border-r-[50%] border-t-[100%] border-solid border-l-transparent border-r-transparent border-t-yellow-600" style={{borderLeftWidth: 'calc(var(--w)/2)', borderRightWidth: 'calc(var(--w)/2)', borderTopWidth: 'var(--h)', width: '100%', height:'50%', top: '50%', '--w': '100%', '--h': '50%'} as React.CSSProperties}></div>
                    {/* Fix: Cast style object to React.CSSProperties to allow CSS custom properties */}
                    <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[50%] border-b-[50%] border-r-[100%] border-solid border-t-transparent border-b-transparent border-r-blue-600" style={{borderTopWidth: 'calc(var(--h)/2)', borderBottomWidth: 'calc(var(--h)/2)', borderRightWidth: 'var(--w)', width: '50%', height:'100%', '--w': '50%', '--h': '100%'} as React.CSSProperties}></div>
                </div>
            </div>

            {/* Active pieces */}
            {Object.values(players).flatMap(player => player.pieces)
                .filter(p => p.state !== 'home' && p.state !== 'finished')
                .map(piece => {
                    const pos = piece.position < HOME_PATH_START ? BOARD_LAYOUT[piece.position] : getHomeRunPosition(piece);
                    if (!pos) return null;

                    // Each cell is 100/15 = 6.666...% of the board's dimension.
                    // Calculate top/left for smooth animation.
                    const top = `${(pos.row - 1) * (100 / 15)}%`;
                    const left = `${(pos.col - 1) * (100 / 15)}%`;
                    const size = `${100 / 15}%`;
                    const isBouncing = animatedPiece === `${piece.color}-${piece.id}`;

                    return (
                        <Piece
                            key={`${piece.color}-${piece.id}`}
                            piece={piece}
                            onClick={() => movePiece(piece)}
                            isMovable={movablePieces.has(`${piece.color}-${piece.id}`)}
                            isBouncing={isBouncing}
                            style={{
                                position: 'absolute',
                                top,
                                left,
                                width: size,
                                height: size,
                                transform: 'scale(0.9)',
                            }}
                        />
                    );
            })}

        </div>
    );
};

export default LudoBoard;