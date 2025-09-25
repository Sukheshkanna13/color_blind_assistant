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

  const handleLogin = (username: string, password: string) => {
    // In a real application, you would validate credentials here
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
<<<<<<< Updated upstream
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
=======
      <header className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
>>>>>>> Stashed changes
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">IntelliColor</h1>
                <p className="text-gray-400 text-sm">AI Vision Platform</p>
              </div>
            </div>

<<<<<<< Updated upstream
            {/* User Info and Logout */}
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed - Takes up 2 columns on large screens */}
=======
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
>>>>>>> Stashed changes
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Vision Feed</h2>
              <p className="text-gray-400 text-sm mb-6">
                Real-time camera input for AI analysis and mode-specific processing
              </p>
            </div>
            <CameraFeed isActive={isCameraActive} currentMode={currentMode} />
          </div>

<<<<<<< Updated upstream
          {/* Control Panel */}
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
            {/* System Status */}
=======
>>>>>>> Stashed changes
            <div className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl">
              <h4 className="font-semibold mb-4 text-gray-300">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Camera Feed</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isCameraActive ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {isCameraActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">AI Processing</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      currentMode ? 'bg-cyan-400 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {currentMode ? 'Ready' : 'Standby'}
                    </span>
                  </div>
                </div>
<<<<<<< Updated upstream
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Connection</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ML Model Integration Notice */}
=======
              </div>
            </div>

>>>>>>> Stashed changes
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-blue-400 mb-1">ML Model Integration</h5>
                  <p className="text-xs text-gray-300">
                    Ready for .pt/.pkl model integration. Models will run client-side for real-time processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;