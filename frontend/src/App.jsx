import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CognitiveCheck from './CognitiveCheck.jsx';
import RiskReport from './RiskReport.jsx';
import HistoryGraph from './HistoryGraph.jsx';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen p-4 max-w-3xl mx-auto">
        <nav className="mb-6 flex space-x-6 text-blue-800 font-semibold">
          <Link to="/" className="hover:underline">Check-In</Link>
          <Link to="/history" className="hover:underline">History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CognitiveCheck />} />
          <Route path="/report" element={<RiskReport />} />
          <Route path="/history" element={<HistoryGraph />} />
        </Routes>
      </div>
    </Router>
  );
}
