import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScoreList from './features/scoreList/ScoreList';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/score/:examId" element={<ScoreList />} />
      </Routes>
    </Router>
  );
}

export default App;
