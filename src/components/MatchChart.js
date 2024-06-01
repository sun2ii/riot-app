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
  // Grab the last 15 matches
  const recentMatchDetails = matchDetails.slice(-15);
  const labels = recentMatchDetails.map((_, index) => `Match ${index + 1}`);

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

    return participant;
  };

  const kills = recentMatchDetails.map(match => getParticipantData(match).kills || 0);
  const deaths = recentMatchDetails.map(match => getParticipantData(match).deaths || 0);
  const assists = recentMatchDetails.map(match => getParticipantData(match).assists || 0);
  const goldEarned = recentMatchDetails.map(match => getParticipantData(match).goldEarned || 0);
  const damageDealt = recentMatchDetails.map(match => getParticipantData(match).totalDamageDealtToChampions || 0);
  const visionScore = recentMatchDetails.map(match => getParticipantData(match).visionScore || 0);
  const totalCS = recentMatchDetails.map(match => {
    const participant = getParticipantData(match);
    return (participant.totalMinionsKilled || 0) + (participant.neutralMinionsKilled || 0);
  });
  const wardsPlaced = recentMatchDetails.map(match => getParticipantData(match).wardsPlaced || 0);
  const damageTaken = recentMatchDetails.map(match => getParticipantData(match).totalDamageTaken || 0);
  const timeCCingOthers = recentMatchDetails.map(match => getParticipantData(match).timeCCingOthers || 0);
  const totalTimeSpentDead = recentMatchDetails.map(match => (getParticipantData(match).totalTimeSpentDead / 60).toFixed(2) || 0);
  const matchLengths = recentMatchDetails.map(match => (match.info.gameDuration / 60).toFixed(2) || 0);

  const championNames = recentMatchDetails.map(match => getParticipantData(match).championName || 'Unknown Champion');

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

  const largeScaleLineData = {
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
        label: 'Damage Taken',
        borderColor: 'rgba(255, 99, 132, 0.6)',
        data: damageTaken,
        fill: false,
      },
    ],
  };

  const smallScaleLineData = {
    labels,
    datasets: [
      {
        label: 'Vision Score',
        borderColor: 'rgba(255, 159, 64, 0.6)',
        data: visionScore,
        fill: false,
      },
      {
        label: 'Total CS',
        borderColor: 'rgba(75, 192, 192, 0.6)',
        data: totalCS,
        fill: false,
      },
      {
        label: 'Wards Placed',
        borderColor: 'rgba(54, 162, 235, 0.6)',
        data: wardsPlaced,
        fill: false,
      },
      {
        label: 'Time CCing Others',
        borderColor: 'rgba(255, 205, 86, 0.6)',
        data: timeCCingOthers,
        fill: false,
      },
      {
        label: 'Total Time Spent Dead (minutes)',
        borderColor: 'rgba(200, 50, 50, 0.6)',
        data: totalTimeSpentDead,
        fill: false,
      },
      {
        label: 'Match Length (minutes)',
        borderColor: 'rgba(100, 100, 255, 0.6)',
        data: matchLengths,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div>
      <div className="chart-container">
        <div className="champion-names">
          {championNames.map((name, index) => (
            <div key={index} className="champion-name">
              {name}
            </div>
          ))}
        </div>
        <Bar data={barData} options={options} />
      </div>
      <div className="chart-container">
        <Line data={largeScaleLineData} options={options} />
      </div>
      <div className="chart-container">
        <Line data={smallScaleLineData} options={options} />
      </div>
    </div>
  );
};

export default MatchChart;