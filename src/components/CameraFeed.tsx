// src/backend/components/CameraFeed.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { sendImageToBackend } from '../utils/api';

interface CameraFeedProps {
  isActive: boolean;
  currentMode: string;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isActive, currentMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !currentMode || !isActive) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          setIsLoading(true);
          try {
            const response = await sendImageToBackend(blob, currentMode);
            setResult(response.result);
          } catch (err) {
            setError('Error processing image');
          }
          setIsLoading(false);
        }
      }, 'image/jpeg');
    }
  };

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium mb-2">Camera Access Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={startCamera}
            className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleCapture}
          disabled={!isActive || !currentMode || isLoading}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Capture & Analyze'}
        </button>
      </div>

      {result && (
        <div className="absolute bottom-20 left-4 right-4 px-4 py-2 bg-black/70 
                      backdrop-blur-sm rounded-lg border border-cyan-400/50">
          <p className="text-cyan-400 text-sm">Result: {result}</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white font-medium">Initializing Camera...</p>
          </div>
        </div>
      )}

      {currentMode && !isLoading && (
        <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg border border-cyan-400/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 font-medium text-sm">{currentMode} Mode Active</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4">
        {stream ? (
          <Camera className="w-6 h-6 text-green-400" />
        ) : (
          <CameraOff className="w-6 h-6 text-red-400" />
        )}
      </div>
    </div>
  );
};

export default CameraFeed;