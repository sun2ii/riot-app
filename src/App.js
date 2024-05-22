import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import SearchComponent from './SearchComponent';
import MatchDetails from './MatchDetails';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchComponent />} />
          <Route path="/match/:matchId" element={<MatchDetails />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
