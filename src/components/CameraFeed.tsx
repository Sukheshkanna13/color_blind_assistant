import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
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
  // Initialize state to null to differentiate between "no results yet" and "an empty result set"
  const [results, setResults] = useState<{label: string, confidence: number}[] | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup function to stop the camera when the component unmounts
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
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    } finally {
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
    
    setIsLoading(true);
    setError('');
    setResults(null); // Clear previous results to hide the old display
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });

      if (!blob) throw new Error('Failed to create image blob');

      const response = await sendImageToBackend(blob, currentMode);
      
      setResults(response.detections || []);

    } catch (err) {
      console.error('Capture or API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium mb-2">An Error Occurred</p>
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

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white font-medium">Processing...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={handleCapture}
          disabled={!isActive || !currentMode || isLoading}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Capture & Analyze'}
        </button>
      </div>
      
      {/* --- Improved Results Display --- */}
      {!isLoading && results !== null && (
        <div className="absolute top-4 left-4 right-4 p-4 bg-black/70 
                        backdrop-blur-sm rounded-lg border border-cyan-400/50 max-h-48 overflow-y-auto z-10">
          
          {results.length > 0 ? (
            <>
              <h3 className="text-cyan-400 font-bold text-lg mb-2 text-center">Detections</h3>
              <ul>
                  {results.map((item, index) => (
                      <li key={index} className="flex justify-between items-center text-white text-sm mb-1">
                          <span>{item.label}</span>
                          <span className="font-mono text-gray-300">{Math.round(item.confidence * 100)}%</span>
                      </li>
                  ))}
              </ul>
            </>
          ) : (
            <p className="text-center text-gray-400">No objects detected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;