import React, { useRef, useState } from 'react';
import { sendImageToBackend } from '../utils/api';

interface CameraFeedProps {
  currentMode: string;
  isActive: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ currentMode, isActive }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Capture image from video stream
  const handleCapture = async () => {
    if (!videoRef.current || !currentMode || !isActive) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          setLoading(true);
          try {
            const response = await sendImageToBackend(blob, currentMode);
            setResult(response.result);
          } catch (err) {
            setResult('Error processing image');
          }
          setLoading(false);
        }
      }, 'image/jpeg');
    }
  };

  // Start camera on mount
  React.useEffect(() => {
    if (isActive && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        });
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} autoPlay playsInline className="rounded-lg border border-gray-700 w-full max-w-md" />
      <button
        onClick={handleCapture}
        disabled={!isActive || !currentMode || loading}
        className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Capture & Analyze'}
      </button>
      {result && (
        <div className="mt-2 p-2 bg-gray-800 rounded text-cyan-300">
          Result: {result}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;