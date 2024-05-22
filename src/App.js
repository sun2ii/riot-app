import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import MatchDetails from './MatchDetails'; // We'll create this next

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchComponent />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
