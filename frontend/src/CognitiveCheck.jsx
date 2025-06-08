import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeText } from './api.js';
import { useNavigate } from 'react-router-dom';

export default function CognitiveCheck() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await analyzeText({ text });
    localStorage.setItem('latestAnalysis', res.analysis);
    navigate('/report');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
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
