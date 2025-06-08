import React from 'react';
import { Link } from 'react-router-dom';

export default function RiskReport() {
  const analysis = localStorage.getItem('latestAnalysis') || 'No data.';
  const transcript = localStorage.getItem('latestTranscript') || '';
  const risk = JSON.parse(localStorage.getItem('latestRisk') || '{}');
  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Voice Transcript</h2>
        <p className="whitespace-pre-line">{transcript}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Text Analysis</h2>
        <p className="whitespace-pre-line">{analysis}</p>
      </div>
      {risk.risk_level && (
        <div className="p-3 bg-gray-100 rounded">
          <p><span className="font-semibold">Risk Level:</span> {risk.risk_level}</p>
          <p><span className="font-semibold">Flags:</span> {risk.flags}</p>
          <p className="mt-1">{risk.summary}</p>
        </div>
      )}
      <Link to="/" className="text-blue-600">Back to check-in</Link>
    </div>
  );
}
