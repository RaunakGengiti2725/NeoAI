import React from 'react';

export default function HistoryGraph() {
  // Mocked data for demonstration
  const data = [
    { date: 'Day 1', risk: 10 },
    { date: 'Day 2', risk: 20 },
    { date: 'Day 3', risk: 15 },
  ];

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Cognitive Stability Map</h2>
      <ul className="space-y-1">
        {data.map(d => (
          <li key={d.date} className="flex justify-between">
            <span>{d.date}</span>
            <span>{d.risk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
