import React, { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameContext';
import Piece from './Piece';
import { BOARD_LAYOUT, PLAYER_AREA_LAYOUT, HOME_ENTRANCE, START_POSITIONS } from '../constants';
import type { GameContextType, Piece as PieceType, PlayerColor } from '../types';

const LudoBoard: React.FC = () => {
    const { gameState, movePiece, loggedInUser } = useContext(GameContext) as GameContextType;
    const { players, currentTurn, diceValue } = gameState;

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
        let bgColor = 'bg-gray-700/50';
        let isStar = false;
        
        // Paths
        if (row === 8 && col > 1 && col < 8) bgColor = 'bg-red-500/70';
        if (row === 8 && col > 8 && col < 15) bgColor = 'bg-yellow-500/70';
        if (col === 8 && row > 1 && row < 8) bgColor = 'bg-green-500/70';
        if (col === 8 && row > 8 && row < 15) bgColor = 'bg-blue-500/70';

        if ((row > 6 && row < 10) || (col > 6 && col < 10)) {
            bgColor = 'bg-gray-800/60';
        }
        
        // Start cells
        if (row === 7 && col === 2) { bgColor = 'bg-red-500/70'; isStar = true; }
        if (row === 2 && col === 9) { bgColor = 'bg-green-500/70'; isStar = true; }
        if (row === 9 && col === 14) { bgColor = 'bg-yellow-500/70'; isStar = true; }
        if (row === 14 && col === 7) { bgColor = 'bg-blue-500/70'; isStar = true; }
        
        // Other safe cells
        if ((row === 3 && col === 7) || (row === 7 && col === 13) || (row === 13 && col === 9) || (row === 9 && col === 3)) {
             isStar = true;
        }

        return <div key={key} className={`w-full h-full border border-gray-600/50 ${bgColor} flex items-center justify-center`}>{isStar && <span className="text-xl text-gray-400">★</span>}</div>;
    };

    const getHomeRunPosition = (piece: PieceType) => {
        const offset = piece.position - 52;
        switch(piece.color) {
            case 'red': return BOARD_LAYOUT[52 + offset];
            case 'green': return BOARD_LAYOUT[58 + offset];
            case 'yellow': return BOARD_LAYOUT[64 + offset];
            case 'blue': return BOARD_LAYOUT[70 + offset];
            default: return {row: 0, col: 0};
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
                        {players[color as PlayerColor].pieces.filter(p => p.state === 'home').map((piece, i) => (
                             <Piece 
                                key={piece.id} 
                                piece={piece} 
                                onClick={() => movePiece(piece)} 
                                isMovable={movablePieces.has(`${piece.color}-${piece.id}`)}
                                style={{
                                    top: `calc(${layout.homePieces[i].top} - 12.5%)`,
                                    left: `calc(${layout.homePieces[i].left} - 12.5%)`,
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
                    <div className="absolute top-0 left-0 w-0 h-0 border-l-[50%] border-r-[50%] border-b-[100%] border-solid border-l-transparent border-r-transparent border-b-red-600" style={{borderLeftWidth: 'calc(var(--w)/2)', borderRightWidth: 'calc(var(--w)/2)', borderBottomWidth: 'var(--h)', width: '100%', height:'100%', '--w': '100%', '--h': '50%'} as React.CSSProperties}></div>
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
                    const pos = piece.position < 52 ? BOARD_LAYOUT[piece.position] : getHomeRunPosition(piece);
                    if(!pos) return null;
                    return (
                        <Piece 
                            key={`${piece.color}-${piece.id}`}
                            piece={piece}
                            onClick={() => movePiece(piece)}
                            isMovable={movablePieces.has(`${piece.color}-${piece.id}`)}
                            style={{
                                gridRowStart: pos.row,
                                gridColumnStart: pos.col,
                                transform: 'scale(0.9)'
                            }}
                        />
                    );
            })}

        </div>
    );
};

export default LudoBoard;