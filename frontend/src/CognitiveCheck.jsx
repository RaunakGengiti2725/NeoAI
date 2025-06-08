import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceRecorder from './VoiceRecorder.jsx';
import FaceCamera from './FaceCamera.jsx';
import { analyzeText, evaluateRisk } from './api.js';
import { useNavigate } from 'react-router-dom';

export default function CognitiveCheck() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState({ transcript: '', analysis: '' });
  const [face, setFace] = useState({ analysis: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await analyzeText({ text });
    const risk = await evaluateRisk({
      text,
      transcript: voice.transcript,
      face_analysis: face.analysis,
    });
    localStorage.setItem('latestAnalysis', res.analysis);
    localStorage.setItem('latestVoiceAnalysis', voice.analysis || '');
    localStorage.setItem('latestTranscript', voice.transcript);
    localStorage.setItem('latestFaceAnalysis', face.analysis || '');
    localStorage.setItem('latestRisk', JSON.stringify(risk));
    const history = JSON.parse(localStorage.getItem('riskHistory') || '[]');
    history.push({ date: new Date().toISOString(), risk: risk.risk_level });
    localStorage.setItem('riskHistory', JSON.stringify(history));
    navigate('/report');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <VoiceRecorder onResult={setVoice} />
      <FaceCamera onResult={setFace} />
      <label className="block">
        <span className="text-gray-700">How are you feeling today?</span>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300"
          rows="4"
        />
      </label>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </motion.button>
    </form>
  );
}
