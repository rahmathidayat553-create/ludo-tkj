import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameContextType } from '../types';

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
    const faceClasses = "grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2";
    const dot = <div className="w-3 h-3 bg-white rounded-full"></div>;

    const arrangements: {[key: number]: React.ReactNode[]} = {
        1: [<div key="1-1" className="col-start-2 row-start-2 flex justify-center items-center">{dot}</div>],
        2: [<div key="2-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="2-2" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>],
        3: [<div key="3-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="3-2" className="col-start-2 row-start-2 flex justify-center items-center">{dot}</div>, <div key="3-3" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>],
        4: [<div key="4-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="4-2" className="col-start-3 row-start-1 flex justify-center items-center">{dot}</div>, <div key="4-3" className="col-start-1 row-start-3 flex justify-center items-center">{dot}</div>, <div key="4-4" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>],
        5: [<div key="5-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="5-2" className="col-start-3 row-start-1 flex justify-center items-center">{dot}</div>, <div key="5-3" className="col-start-2 row-start-2 flex justify-center items-center">{dot}</div>, <div key="5-4" className="col-start-1 row-start-3 flex justify-center items-center">{dot}</div>, <div key="5-5" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>],
        6: [<div key="6-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="6-2" className="col-start-3 row-start-1 flex justify-center items-center">{dot}</div>, <div key="6-3" className="col-start-1 row-start-3 flex justify-center items-center">{dot}</div>, <div key="6-4" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>],
    };
    
    // A 6-sided die can't have two dots on the same row for value 6, fixing layout
    if (value === 6) {
         arrangements[6] = [
            <div key="6-1" className="col-start-1 row-start-1 flex justify-center items-center">{dot}</div>, <div key="6-2" className="col-start-1 row-start-2 flex justify-center items-center">{dot}</div>, <div key="6-3" className="col-start-1 row-start-3 flex justify-center items-center">{dot}</div>,
            <div key="6-4" className="col-start-3 row-start-1 flex justify-center items-center">{dot}</div>, <div key="6-5" className="col-start-3 row-start-2 flex justify-center items-center">{dot}</div>, <div key="6-6" className="col-start-3 row-start-3 flex justify-center items-center">{dot}</div>
         ];
    }
    
    return <div className={faceClasses}>{arrangements[value] || null}</div>;
};

const Dice: React.FC = () => {
    const { gameState, rollDice, loggedInUser } = useContext(GameContext) as GameContextType;
    const { isRolling, diceValue, currentTurn, winner } = gameState;
    const [finalSideClass, setFinalSideClass] = useState('show-1');

    const isMyTurn = loggedInUser?.role === 'player' && loggedInUser.color === currentTurn;
    const canRoll = isMyTurn && !isRolling && diceValue === null && !winner;

    useEffect(() => {
        if (!isRolling && diceValue !== null) {
            setFinalSideClass(`show-${diceValue}`);
        }
    }, [isRolling, diceValue]);

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={rollDice}
                disabled={!canRoll}
                className={`w-24 h-24 p-0 bg-transparent border-none
                ${canRoll ? 'cursor-pointer hover:scale-110 transform transition-transform' : 'cursor-not-allowed opacity-50'}`}
                aria-label={canRoll ? "Roll dice" : "Dice"}
            >
                <div className="scene">
                    <div className={`cube ${isRolling ? 'is-rolling' : finalSideClass}`}>
                        <div className="cube__face cube__face--1"><DiceFace value={1} /></div>
                        <div className="cube__face cube__face--2"><DiceFace value={2} /></div>
                        <div className="cube__face cube__face--3"><DiceFace value={3} /></div>
                        <div className="cube__face cube__face--4"><DiceFace value={4} /></div>
                        <div className="cube__face cube__face--5"><DiceFace value={5} /></div>
                        <div className="cube__face cube__face--6"><DiceFace value={6} /></div>
                    </div>
                </div>
            </button>
            <p className="mt-4 text-sm text-gray-400 font-semibold h-5">
                {canRoll ? "Click to Roll!" : (diceValue !== null ? `You rolled a ${diceValue}!` : "Waiting for turn...")}
            </p>
        </div>
    );
};

export default Dice;