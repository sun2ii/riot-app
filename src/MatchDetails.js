import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MatchDetails = () => {
  const { matchId } = useParams(); // Get the matchId from the URL
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
    <div>
      <h2>Match Details for {matchId}</h2>
      <pre>{JSON.stringify(matchData, null, 2)}</pre>
    </div>
  );
};

export default MatchDetails;
