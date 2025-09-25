import React, { useState } from 'react';
import LoginPanel from './components/LoginPanel';
import CameraFeed from './components/CameraFeed';
import ModeSelector from './components/ModeSelector';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleLogin = (username: string, password: string) => {
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
      {/* Header and other UI */}
      <ModeSelector
        currentMode={currentMode}
        onModeChange={handleModeChange}
        isActive={isCameraActive}
      />
      <CameraFeed
        currentMode={currentMode}
        isActive={isCameraActive}
      />
      {/* Add logout and other controls as needed */}
    </div>
  );
}

export default App;