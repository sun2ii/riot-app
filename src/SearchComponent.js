import React, { useState } from 'react';
import axios from 'axios';
import './SearchComponent.css'; 

const SearchComponent = () => {
  const [fullName, setFullName] = useState('');
  const [data, setData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const [name, tagline] = fullName.split('#');
    if (!name || !tagline) {
      console.error('Invalid format. Please use name#tagline.');
      return;
    }

    try {
      const response = await axios.get(`/api/search`, {
        params: { name, tagline }
      });
      setData(response.data);
      fetchMatchHistory(response.data.puuid);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMatchHistory = async (puuid) => {
    try {
      const response = await axios.get(`/api/match-history`, {
        params: { puuid }
      });
      setMatchHistory(response.data);
    } catch (error) {
      console.error('Error fetching match history:', error);
    }
  };

    const handleMatchClick = (matchId) => {
    console.log(`Match ID clicked: ${matchId}`);
    // You can add additional logic here, such as navigating to a detailed match page or displaying a modal
  };

  return (
    <div>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter name#tagline"
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h3>Summoner Name: {fullName}</h3>
          <h4>Recent Matches:</h4>
          <ul>
            {matchHistory.map((match, index) => (
              <li key={index} onClick={() => handleMatchClick(match)}>
                <button>{match}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;