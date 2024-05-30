import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './SearchComponent.css';

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
      {matchDetails.length > 0 && (
        <div>
          <h4>Details of Last 3 Matches:</h4>
          {matchDetails.map((match, index) => {
            const participant = match.info.participants.find(p => p.puuid === searchData.data.puuid);
            const team = match.info.teams.find(t => t.teamId === participant.teamId);
            return (
              <div key={index} className="match-details">
                <h5>Match {index + 1}:</h5>
                <p>Win: {team.win ? 'Yes' : 'No'}</p>
                <p>Kills: {participant.kills}</p>
                <p>Deaths: {participant.deaths}</p>
                <p>Assists: {participant.assists}</p>
                <p>KDA: {participant.challenges.kda}</p>
                <p>Gold Earned: {participant.goldEarned}</p>
                <p>Total Damage Dealt to Champions: {participant.totalDamageDealtToChampions}</p>
                <p>Vision Score: {participant.visionScore}</p>
                <p>Game Duration: {Math.floor(match.info.gameDuration / 60)} minutes</p>
                <p>First Blood Kill: {participant.firstBloodKill ? 'Yes' : 'No'}</p>
              </div>
            );
          })}
        </div>
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