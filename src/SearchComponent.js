import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
  const [fullName, setFullName] = useState('');
  const [data, setData] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);

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

  return (
    <div>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter name#tagline"
      />
      <button onClick={handleSearch}>Search</button>
      {data && (
        <div>
          <h3>Summoner Name: {data.name}</h3>
          <p>Level: {data.summonerLevel}</p>
          <h4>Recent Matches:</h4>
          <ul>
            {matchHistory.map((match, index) => (
              <li key={index}>{match}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;