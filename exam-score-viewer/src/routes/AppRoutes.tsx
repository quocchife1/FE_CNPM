import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScorePage from '../pages/ScorePage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:examId" element={<ScorePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
