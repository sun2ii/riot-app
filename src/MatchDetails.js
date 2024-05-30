import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MatchDetails.css'; // Create this file for styles

const MatchDetails = () => {
  const { matchId, puuid } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`/api/match-details`, {
          params: { matchId }
        });
        console.log('Match data:', response.data); // Log match data
        setMatchData(response.data);

        // Find the participant with the specified puuid
        const participant = response.data.info.participants.find(p => p.puuid === puuid);
        console.log('Participant:', participant); // Log participant data
        setParticipant(participant);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching match details:', error);
        setError('Error fetching match details. Please try again.');
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId, puuid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!participant) return <p>Participant not found</p>;

  const team = matchData.info.teams.find(t => t.teamId === participant.teamId);

  return (
    <div className="match-details-container">
      <h2>Match Details for {matchId}</h2>
      {matchData && (
        <div>
          <p>Win: {team.win ? 'Yes' : 'No'}</p>
          <p>Kills: {participant.kills}</p>
          <p>Deaths: {participant.deaths}</p>
          <p>Assists: {participant.assists}</p>
          <p>KDA: {participant.challenges.kda}</p>
          <p>Gold Earned: {participant.goldEarned}</p>
          <p>Total Damage Dealt to Champions: {participant.totalDamageDealtToChampions}</p>
          <p>Vision Score: {participant.visionScore}</p>
          <p>Game Duration: {Math.floor(matchData.info.gameDuration / 60)} minutes</p>
          <p>First Blood Kill: {participant.firstBloodKill ? 'Yes' : 'No'}</p>
          <button onClick={() => navigate(-1)}>Back</button> {/* Back button */}
        </div>
      )}
    </div>
  );
};

export default MatchDetails;