import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../css/MatchChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MatchChart = ({ puuid, matchDetails }) => {
  const labels = matchDetails.map((_, index) => `Match ${index + 1}`);
  
  const getParticipantData = (match) => {
    if (!match.info || !match.info.participants) {
      console.error('Invalid match data structure:', match);
      return {};
    }

    const participant = match.info.participants.find(p => p.puuid === puuid);
    if (!participant) {
      console.error('Participant not found for puuid:', puuid);
      return {};
    }
    
    console.log('Participant data for match:', participant); // Debugging log
    return participant;
  };

  const kills = matchDetails.map(match => getParticipantData(match).kills || 0);
  const deaths = matchDetails.map(match => getParticipantData(match).deaths || 0);
  const assists = matchDetails.map(match => getParticipantData(match).assists || 0);
  const goldEarned = matchDetails.map(match => getParticipantData(match).goldEarned || 0);
  const damageDealt = matchDetails.map(match => getParticipantData(match).totalDamageDealtToChampions || 0);
  const visionScore = matchDetails.map(match => getParticipantData(match).visionScore || 0);

  const barData = {
    labels,
    datasets: [
      {
        label: 'Kills',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        data: kills,
      },
      {
        label: 'Deaths',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        data: deaths,
      },
      {
        label: 'Assists',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        data: assists,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Gold Earned',
        borderColor: 'rgba(255, 206, 86, 0.6)',
        data: goldEarned,
        fill: false,
      },
      {
        label: 'Total Damage Dealt to Champions',
        borderColor: 'rgba(153, 102, 255, 0.6)',
        data: damageDealt,
        fill: false,
      },
      {
        label: 'Vision Score',
        borderColor: 'rgba(255, 159, 64, 0.6)',
        data: visionScore,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2 className="title-match-statistics">Match Statistics</h2>
      <div className="chart-container">
        <Bar data={barData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <Line data={lineData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default MatchChart;