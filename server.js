const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

app.get('/api/search', async (req, res) => {
  const { name, tagline } = req.query;
  const apiKey = 'RGAPI-b6236add-d7a2-4546-be02-11495ffc5dca';
  try {
    const response = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}?api_key=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
