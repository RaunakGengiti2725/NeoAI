import React, { useRef, useEffect, useState } from 'react';
import { analyzeFace } from './api.js';

export default function FaceCamera({ onResult }) {
  const videoRef = useRef(null);
  const [analysis, setAnalysis] = useState('');

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('camera error', err);
      }
    };
    start();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];
    const res = await analyzeFace({ image: base64 });
    setAnalysis(res.analysis || '');
    if (onResult) onResult(res);
  };

  return (
    <div className="space-y-2">
      <video ref={videoRef} autoPlay muted className="w-48 h-36 rounded bg-black" />
      <button onClick={capture} className="px-3 py-1 bg-blue-600 text-white rounded">
        Capture Face
      </button>
      {analysis && <p className="text-sm mt-1">{analysis}</p>}
    </div>
  );
}
