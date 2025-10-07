
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameContextType } from '../types';

const AdminDashboard: React.FC = () => {
  const { gameState, logout, loggedInUser } = useContext(GameContext) as GameContextType;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <p className="text-gray-400">Live Ludo Game Monitoring</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-semibold"
        >
          Logout ({loggedInUser?.username})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Current Turn</h3>
            <p className="text-2xl font-bold text-white capitalize">{gameState.currentTurn}</p>
        </div>
         <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Dice Value</h3>
            <p className="text-2xl font-bold text-white">{gameState.diceValue ?? 'N/A'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Winner</h3>
            <p className="text-2xl font-bold text-white capitalize">{gameState.winner ?? 'None'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm">Game Status</h3>
            <p className="text-xl font-bold text-white">{gameState.message}</p>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Full Game State</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-xs overflow-auto">
          {JSON.stringify(gameState, null, 2)}
        </pre>
      </div>
       <div className="mt-8 text-center text-gray-500">
          <p>This dashboard can be extended with more features like game controls, player statistics, etc.</p>
        </div>
    </div>
  );
};

export default AdminDashboard;
