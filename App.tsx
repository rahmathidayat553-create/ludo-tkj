
import React, { useContext } from 'react';
import { GameContext } from './context/GameContext';
import LoginPage from './components/LoginPage';
import GameBoard from './components/GameBoard';
import AdminDashboard from './components/AdminDashboard';
import type { GameContextType } from './types';

const App: React.FC = () => {
  const { loggedInUser } = useContext(GameContext) as GameContextType;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {!loggedInUser ? (
        <LoginPage />
      ) : loggedInUser.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <GameBoard />
      )}
    </div>
  );
};

export default App;
