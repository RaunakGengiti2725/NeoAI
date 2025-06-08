import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VoiceRecorder from './VoiceRecorder.jsx';
import CognitiveCheck from './CognitiveCheck.jsx';
import RiskReport from './RiskReport.jsx';
import HistoryGraph from './HistoryGraph.jsx';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50 font-sans p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-600">Check-In</Link>
          <Link to="/history" className="text-blue-600">History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CognitiveCheck />} />
          <Route path="/voice" element={<VoiceRecorder />} />
          <Route path="/report" element={<RiskReport />} />
          <Route path="/history" element={<HistoryGraph />} />
        </Routes>
      </div>
    </Router>
  );
}
