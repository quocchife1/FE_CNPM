import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ScoreList from './components/ScoreList';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/score/:examId" element={<ScoreList />} />
      </Routes>
    </Router>
    
  );

  <Router>
      <Routes>
        <Route path="/score/:examId" element={<ScoreList />} />
      </Routes>
    </Router>
}

export default App;
