import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import '../css/SearchComponent.css';
import MatchChart from './MatchChart'; // Import the new component

const SearchComponent = () => {
  const { searchData, setSearchData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchDetails, setMatchDetails] = useState([]);
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
      const last3Matches = response.data.slice(0, 3); // Get the last 3 matches
      console.log('Match history response:', last3Matches); // Log match history response
      setSearchData(prev => ({
        ...prev,
        matchHistory: last3Matches
      }));
      fetchMatchDetails(last3Matches);
    } catch (error) {
      console.error('Error fetching match history:', error);
      setError('Error fetching match history. Please try again.');
      setLoading(false);
    }
  };

  const fetchMatchDetails = async (matches) => {
    try {
      const matchDetailsPromises = matches.map(matchId =>
        axios.get(`/api/match-details`, { params: { matchId } })
      );
      const matchDetailsResponses = await Promise.all(matchDetailsPromises);
      const matchDetails = matchDetailsResponses.map(res => res.data);
      console.log('Match details:', matchDetails); // Log match details
      setMatchDetails(matchDetails);
    } catch (error) {
      console.error('Error fetching match details:', error);
      setError('Error fetching match details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (matchId) => {
    const puuid = searchData.data.puuid;
    navigate(`/match/${matchId}/${puuid}`);
  };


  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <h1>Search for Summoner</h1>
      <div className="input-button-container">
        <input
          type="text"
          value={searchData.fullName}
          onChange={(e) => setSearchData({ ...searchData, fullName: e.target.value })}
          onKeyDown={handleEnter}
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
      {matchDetails.length > 0 && (
        <MatchChart
          puuid={searchData.data.puuid}
          matchDetails={matchDetails}
        /> 
      )}
      {searchData.matchHistory.length > 0 && (
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