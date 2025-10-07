
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import LudoBoard from './LudoBoard';
import Dice from './Dice';
import type { GameContextType } from '../types';
import CrownIcon from './icons/CrownIcon';

const GameBoard: React.FC = () => {
    const { gameState, logout, loggedInUser } = useContext(GameContext) as GameContextType;
    const { players, currentTurn, winner, message } = gameState;

    const playerColor = loggedInUser?.color;
    const isMyTurn = currentTurn === playerColor;

    const colorClasses: Record<string, { bg: string, text: string, border: string }> = {
        red: { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-500' },
        green: { bg: 'bg-green-500', text: 'text-green-300', border: 'border-green-500' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-300', border: 'border-blue-500' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-300', border: 'border-yellow-500' },
    };
    
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-900 p-4 gap-8">
            <div className="w-full lg:w-auto flex flex-col items-center">
                <div className="flex justify-between w-full max-w-2xl mb-4">
                     <h1 className="text-3xl font-bold text-cyan-400">Permainan Ludo</h1>
                     <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-semibold"
                    >
                        Keluar ({loggedInUser?.username})
                    </button>
                </div>
                <LudoBoard />
            </div>

            <div className="w-full lg:w-80 bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-center mb-4 border-b border-gray-600 pb-2">Info Permainan</h2>

                {winner ? (
                    <div className="text-center p-4 rounded-lg bg-yellow-500/20 border border-yellow-500">
                        <div className="flex justify-center items-center gap-2">
                           <CrownIcon className="w-8 h-8 text-yellow-400" />
                           <p className={`text-xl font-bold ${colorClasses[winner]?.text}`}>{players[winner].name} Menang!</p>
                        </div>
                    </div>
                ) : (
                    <div className={`p-4 rounded-lg text-center border-2 transition-all duration-300 ${isMyTurn && playerColor ? colorClasses[playerColor].border : 'border-gray-600'}`}>
                        <p className="text-sm text-gray-400">Giliran Saat Ini</p>
                        <p className={`text-2xl font-bold ${colorClasses[currentTurn]?.text}`}>{players[currentTurn].name}</p>
                    </div>
                )}
                
                <div className="my-6 flex justify-center">
                   <Dice />
                </div>

                <div className="bg-gray-900/50 p-3 rounded-lg min-h-[50px] flex items-center justify-center text-center">
                    <p className="text-gray-300 italic">{message}</p>
                </div>
                
                <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold text-center text-gray-400">Skor Pemain</h3>
                    {Object.values(players).map(player => (
                        <div key={player.color} className={`flex items-center justify-between p-2 rounded-md ${colorClasses[player.color].bg}/20`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${colorClasses[player.color].bg}`}></div>
                                <span className="font-medium text-gray-200">{player.name}</span>
                            </div>
                            <span className="font-mono text-lg text-gray-300">
                                {player.pieces.filter(p => p.state === 'finished').length}/4
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;