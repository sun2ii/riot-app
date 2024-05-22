const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8000;

const apiKey = process.env.REACT_APP_RIOT_API_KEY;

// Path to cache file
const cacheFilePath = path.join(__dirname, 'cache.json');
console.log('Cache file path:', cacheFilePath);

// Function to read cache
const readCache = () => {
  if (fs.existsSync(cacheFilePath)) {
    const rawData = fs.readFileSync(cacheFilePath);
    console.log('Read cache:', rawData);
    return JSON.parse(rawData);
  }
  return {};
};

// Function to write to cache
const writeCache = (cache) => {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
  console.log('Cache updated:', cache);
};

// API route to get summoner inf
app.get('/api/search', async (req, res) => {
  const { name, tagline } = req.query;

  // Read cache
  const cache = readCache();
  const cacheKey = `${name}#${tagline}`;

  // Check if puuid is already cached
  if (cache[cacheKey]) {
    console.log(`Cache hit for ${cacheKey}:`, cache[cacheKey]);
    return res.json({ puuid: cache[cacheKey] });
  } else {
    try {
      const response = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}?api_key=${apiKey}`);
      const data = response.data;

      // Cache the puuid
      cache[cacheKey] = data.puuid;
      writeCache(cache);

      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(error.response ? error.response.status : 500).send(error.message);
    }
  }
});

app.get('/api/match-history', async (req, res) => {
  const { puuid } = req.query;
  const start = 0;
  const count = 20;

  if (!puuid) {
    return res.status(400).send('PUUID is required');
  }

  try {
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`);
    const matchIds = response.data;
    res.json(matchIds);
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/IdRWSNSCRlf7NLADVA4YevpGpu2vmUaXpMHqxz-mwLF7EaRvzONmT0GskOeRv48-vM--2upibo2eNQ/ids?start=0&count=20&api_key=RGAPI-3d63b5b4-93d6-46f7-81ca-f0595aae95c5
// https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/IdRWSNSCRlf7NLADVA4YevpGpu2vmUaXpMHqxz-mwLF7EaRvzONmT0GskOeRv48-vM--2upibo2eNQ/ids?start=0&count=20&api_key=RGAPI-b6236add-d7a2-4546-be02-11495ffc5dca