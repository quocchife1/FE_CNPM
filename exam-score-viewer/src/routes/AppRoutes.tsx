import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScorePage from '../pages/ScorePage';
import AuditLogPage from '../pages/AuditLogPage';
import UserProfilePage from '../pages/ProfilePage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="score/:examId" element={<ScorePage />} />
        <Route path="/auditlogs" element={<AuditLogPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
