import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './SearchComponent.css';

const SearchComponent = () => {
  const { searchData, setSearchData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    const [name, tagline] = searchData.fullName.split('#');
    if (!name || !tagline) {
      setError('Invalid format. Please use name#tagline.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await axios.get('/api/search', {
        params: { name, tagline, region: searchData.region }
      });
      setSearchData(prev => ({
        ...prev,
        data: response.data,
        matchHistory: []
      }));
      fetchMatchHistory(response.data.puuid);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  const fetchMatchHistory = async (puuid) => {
    try {
      const response = await axios.get('/api/match-history', {
        params: { puuid, region: searchData.region }
      });
      console.log('Match history response:', response.data); // Log match history response
      setSearchData(prev => ({
        ...prev,
        matchHistory: response.data
      }));
    } catch (error) {
      console.error('Error fetching match history:', error);
      setError('Error fetching match history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (matchId) => {
    const puuid = searchData.data.puuid;
    console.log('Navigating to match details with puuid:', puuid); // Log puuid
    navigate(`/match/${matchId}/${puuid}`);
  };

  return (
    <div className="container">
      <h1>Search for Summoner</h1>
      <div className="input-button-container">
        <input
          type="text"
          value={searchData.fullName}
          onChange={(e) => setSearchData({ ...searchData, fullName: e.target.value })}
          placeholder="Enter name#tagline"
        />
        <select
          value={searchData.region}
          onChange={(e) => setSearchData({ ...searchData, region: e.target.value })}
        >
          <option value="americas">Americas</option>
          <option value="euw">EUW</option>
          <option value="asia">Asia</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searchData.data && (
        <div>
          <h4>Recent Matches:</h4>
          <ul>
            {searchData.matchHistory.map((match, index) => (
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