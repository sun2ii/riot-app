import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MatchDetails.css'; // Create this file for styles

const MatchDetails = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`/api/match-details`, {
          params: { matchId }
        });
        setMatchData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match details:', error);
        setError('Error fetching match details. Please try again.');
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="match-details-container">
      <h2>Match Details for {matchId}</h2>
      {matchData && (
        <div>
          <p>Duration: {Math.floor(matchData.info.gameDuration / 60)} minutes</p>
          <p>Game Mode: {matchData.info.gameMode}</p>
          <p>Map: {matchData.info.mapId}</p>
          <button onClick={() => navigate(-1)}>Back</button> {/* Back button */}
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
