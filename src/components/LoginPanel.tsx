import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface LoginPanelProps {
  onLogin: (username: string) => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">IntelliColor</h1>
          <p className="text-gray-400">AI Vision Platform</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Enter your name"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
          >
            Start Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPanel;