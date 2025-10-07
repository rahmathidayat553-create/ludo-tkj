
import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameContextType } from '../types';

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
    const dots = Array.from({ length: value }, (_, i) => i);
    const faceClasses = "grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2";
    const dot = <div className="w-full h-full bg-white rounded-full"></div>;

    const arrangements: {[key: number]: React.ReactNode[]} = {
        1: [<div key="1-1" className="col-start-2 row-start-2">{dot}</div>],
        2: [<div key="2-1" className="col-start-1 row-start-1">{dot}</div>, <div key="2-2" className="col-start-3 row-start-3">{dot}</div>],
        3: [<div key="3-1" className="col-start-1 row-start-1">{dot}</div>, <div key="3-2" className="col-start-2 row-start-2">{dot}</div>, <div key="3-3" className="col-start-3 row-start-3">{dot}</div>],
        4: [<div key="4-1" className="col-start-1 row-start-1">{dot}</div>, <div key="4-2" className="col-start-3 row-start-1">{dot}</div>, <div key="4-3" className="col-start-1 row-start-3">{dot}</div>, <div key="4-4" className="col-start-3 row-start-3">{dot}</div>],
        5: [<div key="5-1" className="col-start-1 row-start-1">{dot}</div>, <div key="5-2" className="col-start-3 row-start-1">{dot}</div>, <div key="5-3" className="col-start-2 row-start-2">{dot}</div>, <div key="5-4" className="col-start-1 row-start-3">{dot}</div>, <div key="5-5" className="col-start-3 row-start-3">{dot}</div>],
        6: [<div key="6-1" className="col-start-1 row-start-1">{dot}</div>, <div key="6-2" className="col-start-3 row-start-1">{dot}</div>, <div key="6-3" className="col-start-1 row-start-2">{dot}</div>, <div key="6-4" className="col-start-3 row-start-2">{dot}</div>, <div key="6-5" className="col-start-1 row-start-3">{dot}</div>, <div key="6-6" className="col-start-3 row-start-3">{dot}</div>],
    };
    
    return <div className={faceClasses}>{arrangements[value] || null}</div>;
};

const Dice: React.FC = () => {
    const { gameState, rollDice, loggedInUser } = useContext(GameContext) as GameContextType;
    const { isRolling, diceValue, currentTurn, winner } = gameState;
    const [displayValue, setDisplayValue] = useState(1);

    const isMyTurn = loggedInUser?.role === 'player' && loggedInUser.color === currentTurn;
    const canRoll = isMyTurn && !isRolling && diceValue === null && !winner;

    useEffect(() => {
        let interval: number;
        if (isRolling) {
            interval = window.setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
            }, 50);
        } else if (diceValue !== null) {
            setDisplayValue(diceValue);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRolling, diceValue]);

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={rollDice}
                disabled={!canRoll}
                className={`w-24 h-24 rounded-2xl bg-gray-700 shadow-lg perspective-1000 transform-style-3d transition-transform duration-500 ease-out 
                ${isRolling ? 'animate-spin' : ''} 
                ${canRoll ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-50'}`}
                style={{ transform: isRolling ? 'translateY(-20px) rotateY(180deg) rotateX(180deg)' : 'translateY(0) rotateY(0) rotateX(0)'}}
            >
                <DiceFace value={displayValue} />
            </button>
            <p className="mt-4 text-sm text-gray-400 font-semibold">
                {canRoll ? "Click to Roll!" : (diceValue !== null ? `You rolled a ${diceValue}!` : "Waiting for turn...")}
            </p>
        </div>
    );
};

export default Dice;
