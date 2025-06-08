import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { sendVoice } from './api.js';

export default function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [level, setLevel] = useState(0);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const res = await sendVoice({ audio: base64 });
        setTranscript(res.transcript || '');
        setAnalysis(res.analysis || '');
        if (onResult) onResult(res);
      };
      reader.readAsDataURL(blob);
      chunks.current = [];
    };
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;
    source.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    const updateLevel = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      setLevel(Math.sqrt(sum / data.length));
      rafRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    cancelAnimationFrame(rafRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setLevel(0);
    setRecording(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow flex flex-col items-start">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={recording ? stopRecording : startRecording}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        {recording ? 'Stop' : 'Record'}
      </motion.button>
      {recording && (
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${Math.min(1, level) * 100}%` }}
          />
        </div>
      )}
      {transcript && <p className="mt-2">{transcript}</p>}
      {analysis && <p className="mt-1 text-sm text-gray-600">{analysis}</p>}
    </div>
  );
}
