import React from 'react';

export default function HistoryGraph() {
  const data = JSON.parse(localStorage.getItem('riskHistory') || '[]');

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Cognitive Stability Map</h2>
      <ul className="space-y-1">
        {data.map(d => (
          <li key={d.date} className="flex justify-between">
            <span>{new Date(d.date).toLocaleDateString()}</span>
            <span className="capitalize">{d.risk || 'unknown'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
