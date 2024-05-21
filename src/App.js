import React from 'react';
import './App.css';
import SearchComponent from './SearchComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Riot Games Summoner Search</h1>
        <SearchComponent />
      </header>
    </div>
  );
}

export default App;