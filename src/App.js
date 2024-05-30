import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchComponent from './components/SearchComponent';
import MatchDetails from './components/MatchDetails';
import { AppProvider } from './AppContext';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchComponent />} />
          <Route path="/match/:matchId/:puuid" element={<MatchDetails />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
