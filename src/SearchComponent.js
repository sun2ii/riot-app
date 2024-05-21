import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
  const [fullName, setFullName] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const [name, tagline] = fullName.split('#');
    if (!name || !tagline) {
      console.error('Invalid format. Please use name#tagline.');
      return;
    }

    try {
      const response = await axios.get(`/api/search`, {
        params: { name, tagline }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter name#tagline"
      />
      <button onClick={handleSearch}>Search</button>
      {data && (
        <div>
          <h3>Summoner Name: {data.name}</h3>
          <p>Level: {data.summonerLevel}</p>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;