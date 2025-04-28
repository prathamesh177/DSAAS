import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import DataExploration from './pages/DataExploration';
import ModelBuilder from './pages/ModelBuilder';
import ModelResults from './pages/ModelResults';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<DataUpload />} />
          <Route path="/explore" element={<DataExploration />} />
          <Route path="/model-builder" element={<ModelBuilder />} />
          <Route path="/results" element={<ModelResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;