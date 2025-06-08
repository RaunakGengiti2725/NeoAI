import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { sendVoice } from './api.js';

export default function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const res = await sendVoice({ audio: base64 });
        setTranscript(res.transcript || '');
        if (onResult) onResult(res);
      };
      reader.readAsDataURL(blob);
      chunks.current = [];
    };
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
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
      {transcript && <p className="mt-2">{transcript}</p>}
    </div>
  );
}
