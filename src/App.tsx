import React, { useState } from 'react';
import LoginPanel from './components/LoginPanel';
import CameraFeed from './components/CameraFeed';
import ModeSelector from './components/ModeSelector';
import { LogOut, Zap, User, Settings } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    setIsCameraActive(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setCurrentMode('');
    setIsCameraActive(false);
  };

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
  };

  if (!isLoggedIn) {
    return <LoginPanel onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <header className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">IntelliColor</h1>
                <p className="text-gray-400 text-sm">AI Vision Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{currentUser}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Vision Feed</h2>
              <p className="text-gray-400 text-sm mb-6">
                Real-time camera input for AI analysis and mode-specific processing
              </p>
            </div>
            <CameraFeed isActive={isCameraActive} currentMode={currentMode} />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                Control Panel
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Select the appropriate AI mode for your analysis needs
              </p>
            </div>

            <ModeSelector
              currentMode={currentMode}
              onModeChange={handleModeChange}
              isActive={isCameraActive}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;