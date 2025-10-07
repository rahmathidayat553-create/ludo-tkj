
import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import type { GameContextType } from '../types';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(GameContext) as GameContextType;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError('');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-4xl font-bold text-center text-cyan-400 mb-2">Ludo King</h1>
        <p className="text-center text-gray-400 mb-8">Dark Theme Edition</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., pemain1 or admin"
              required
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., pemain1 or password123"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-xs text-gray-500 text-center">
            <p className="font-bold">Player Logins:</p>
            <p>pemain1/pemain1, pemain2/pemain2, etc.</p>
            <p className="font-bold mt-2">Admin Login:</p>
            <p>admin/password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
