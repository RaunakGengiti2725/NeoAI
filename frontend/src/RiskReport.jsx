import React from 'react';
import { Link } from 'react-router-dom';

export default function RiskReport() {
  const analysis = localStorage.getItem('latestAnalysis') || 'No data.';
  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
      <p className="mb-4 whitespace-pre-line">{analysis}</p>
      <Link to="/" className="text-blue-600">Back to check-in</Link>
    </div>
  );
}
