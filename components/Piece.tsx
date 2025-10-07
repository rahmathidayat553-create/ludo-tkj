
import React from 'react';
import type { Piece as PieceType } from '../types';

interface PieceProps {
  piece: PieceType;
  onClick: () => void;
  isMovable: boolean;
  style?: React.CSSProperties;
  isBouncing?: boolean;
}

const Piece: React.FC<PieceProps> = ({ piece, onClick, isMovable, style, isBouncing }) => {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500 border-red-300',
    green: 'bg-green-500 border-green-300',
    blue: 'bg-blue-500 border-blue-300',
    yellow: 'bg-yellow-500 border-yellow-300',
  };

  const movableClasses = isMovable
    ? 'cursor-pointer ring-4 ring-offset-2 ring-offset-gray-800 ring-white animate-pulse'
    : '';
  
  const bounceClass = isBouncing ? 'piece-bounce' : '';

  return (
    <div
      onClick={isMovable ? onClick : undefined}
      className={`absolute w-2/3 h-2/3 sm:w-5/6 sm:h-5/6 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform hover:scale-110 ${style ? '' : 'z-10'} ${bounceClass}`}
      style={style}
    >
      <div className={`w-full h-full rounded-full border-4 ${colorClasses[piece.color]} shadow-lg flex items-center justify-center ${movableClasses}`}>
          <div className="w-1/2 h-1/2 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default Piece;