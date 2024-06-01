import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import '../css/SearchComponent.css';
import MatchChart from './MatchChart';

const SearchComponent = () => {
  const { searchData, setSearchData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchDetails, setMatchDetails] = useState([]);
  const [numMatches, setNumMatches] = useState(3); // State for number of matches to display in statistics
  const navigate = useNavigate();

  useEffect(() => {
    if (searchData.puuid) {
      fetchMatchHistory(searchData.puuid, 15); // Fetch 15 matches on initial load
    }
  }, [searchData.puuid]);

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
        params: { name, tagline, region: searchData.region },
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        }
      });
      setSearchData(prev => ({
        ...prev,
        data: response.data,
        matchHistory: [],
        puuid: response.data.puuid  // Store puuid in searchData
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  const fetchMatchHistory = async (puuid, limit) => {
    try {
      const response = await axios.get('/api/match-history', {
        params: { puuid, region: searchData.region },
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        }
      });
      const matches = response.data.slice(0, limit); // Fetch only the number of matches needed
      console.log('Match history response:', matches); // Log match history response
      setSearchData(prev => ({
        ...prev,
        matchHistory: matches
      }));
      fetchMatchDetails(matches, puuid);
    } catch (error) {
      console.error('Error fetching match history:', error);
      setError('Error fetching match history. Please try again.');
      setLoading(false);
    }
  };

  const fetchMatchDetails = async (matches, puuid) => {
    try {
      const matchDetailsPromises = matches.map(matchId =>
        axios.get(`/api/match-details`, {
          params: { matchId },
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
          }
        })
      );
      const matchDetailsResponses = await Promise.all(matchDetailsPromises);
      const matchDetails = matchDetailsResponses.map(res => ({
        ...res.data,
        puuid: puuid // Add the puuid to each match object
      }));
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
    console.log('Navigating to match details with puuid:', puuid); // Log puuid
    navigate(`/match/${matchId}/${puuid}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNumMatchesChange = (event) => {
    setNumMatches(parseInt(event.target.value, 10));
  };

  const displayedMatchDetails = matchDetails.slice(0, numMatches);

  return (
    <div className="container">
      <h1>Search for Summoner</h1>
      <div className="input-button-container">
        <input
          type="text"
          value={searchData.fullName}
          onChange={(e) => setSearchData({ ...searchData, fullName: e.target.value })}
          onKeyPress={handleKeyPress} // Add keypress event listener
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
      <div>
        <label htmlFor="num-matches">Number of matches to display: </label>
        <select id="num-matches" value={numMatches} onChange={handleNumMatchesChange}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {displayedMatchDetails.length > 0 && (
        <div className="chart-container">
          <h2 className="title-match-statistics">Match Statistics</h2>
          <MatchChart
            puuid={searchData.data.puuid}
            matchDetails={displayedMatchDetails}
          />
        </div>
      )}
      {searchData.matchHistory.length > 0 && (
        <div>
          <h4>Recent Matches:</h4>
          <div className="recent-matches">
            {searchData.matchHistory.map((match, index) => (
              <button key={index} onClick={() => handleMatchClick(match)} className="recent-match-button">
                {match}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;