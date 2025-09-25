<<<<<<< Updated upstream
import React from 'react';
=======
import React, { useRef, useState } from 'react';
import { sendImageToBackend } from '../utils/api';
>>>>>>> Stashed changes
import { ChevronDown, Zap } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  isActive: boolean;
}

const modes = [
  { id: 'driving', name: 'Driving Mode', description: 'Road and traffic analysis' },
  { id: 'art', name: 'Art Mode', description: 'Artistic content recognition' },
  { id: 'shopping', name: 'Shopping Mode', description: 'Product identification' },
  { id: 'food', name: 'Food Mode', description: 'Food safety analysis' },
  { id: 'wiring', name: 'Wiring & Diagnosis Mode', description: 'Technical diagnostics' }
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange, isActive }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedMode = modes.find(mode => mode.id === currentMode);

  return (
    <div className="relative w-full max-w-md">
      {/* Mode Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isActive}
        className={`w-full px-6 py-4 bg-gray-800/70 backdrop-blur-sm border border-gray-600 rounded-xl text-left flex items-center justify-between transition-all duration-300 ${
          isActive 
            ? 'hover:bg-gray-700/70 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            currentMode ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <div>
            <p className="text-white font-medium">
              {selectedMode ? selectedMode.name : 'Select Mode'}
            </p>
            {selectedMode && (
              <p className="text-gray-400 text-sm">{selectedMode.description}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && isActive && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-xl border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                onModeChange(mode.id);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left hover:bg-cyan-500/10 transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                currentMode === mode.id ? 'bg-cyan-500/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className={`w-4 h-4 ${
                  currentMode === mode.id ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                <div>
                  <p className={`font-medium ${
                    currentMode === mode.id ? 'text-cyan-400' : 'text-white'
                  }`}>
                    {mode.name}
                  </p>
                  <p className="text-gray-400 text-sm">{mode.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Current Mode Status */}
      {currentMode && (
        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium">
              {selectedMode?.name} Active
            </span>
          </div>
          <p className="text-gray-300 text-xs mt-1">
            AI model ready for {selectedMode?.description.toLowerCase()}
          </p>
        </div>
      )}
      <ModeSelector currentMode={currentMode} onModeChange={(mode) => {}} isActive={isActive} />
    </div>
  );
};

interface ModeSelectorProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  isActive: boolean;
}

const modes = [
  { id: 'driving', name: 'Driving Mode', description: 'Road and traffic analysis' },
  { id: 'art', name: 'Art Mode', description: 'Artistic content recognition' },
  { id: 'shopping', name: 'Shopping Mode', description: 'Product identification' },
  { id: 'food', name: 'Food Mode', description: 'Food safety analysis' },
  { id: 'wiring', name: 'Wiring & Diagnosis Mode', description: 'Technical diagnostics' }
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMode = modes.find(mode => mode.id === currentMode);

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isActive}
        className={`w-full px-6 py-4 bg-gray-800/70 backdrop-blur-sm border border-gray-600 rounded-xl text-left flex items-center justify-between transition-all duration-300 ${
          isActive 
            ? 'hover:bg-gray-700/70 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            currentMode ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <div>
            <p className="text-white font-medium">
              {selectedMode ? selectedMode.name : 'Select Mode'}
            </p>
            {selectedMode && (
              <p className="text-gray-400 text-sm">{selectedMode.description}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {isOpen && isActive && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-xl border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                onModeChange(mode.id);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left hover:bg-cyan-500/10 transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                currentMode === mode.id ? 'bg-cyan-500/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className={`w-4 h-4 ${
                  currentMode === mode.id ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                <div>
                  <p className={`font-medium ${
                    currentMode === mode.id ? 'text-cyan-400' : 'text-white'
                  }`}>
                    {mode.name}
                  </p>
                  <p className="text-gray-400 text-sm">{mode.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeSelector;