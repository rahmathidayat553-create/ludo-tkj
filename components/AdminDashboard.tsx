
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameContextType } from '../types';

const AdminDashboard: React.FC = () => {
  const { gameState, logout, loggedInUser } = useContext(GameContext) as GameContextType;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Dasbor Admin</h1>
          <p className="text-gray-400">Pemantauan Permainan Ludo Langsung</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-semibold"
        >
          Keluar ({loggedInUser?.username})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Giliran Saat Ini</h3>
            <p className="text-2xl font-bold text-white capitalize">{gameState.currentTurn}</p>
        </div>
         <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Nilai Dadu</h3>
            <p className="text-2xl font-bold text-white">{gameState.diceValue ?? 'N/A'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Pemenang</h3>
            <p className="text-2xl font-bold text-white capitalize">{gameState.winner ?? 'Tidak ada'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Status Permainan</h3>
            <p className="text-xl font-bold text-white">{gameState.message}</p>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Status Permainan Lengkap</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-xs overflow-auto">
          {JSON.stringify(gameState, null, 2)}
        </pre>
      </div>
       <div className="mt-8 text-center text-gray-500">
          <p>Dasbor ini dapat diperluas dengan lebih banyak fitur seperti kontrol permainan, statistik pemain, dll.</p>
        </div>
    </div>
  );
};

export default AdminDashboard;