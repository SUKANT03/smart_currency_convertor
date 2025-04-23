// proxy-server.js

const express = require('express');
const axios = require('axios').default;
const app = express();
const port = 4000; // Choose any available port

// Proxy endpoint
app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({ error: 'Failed to fetch exchange rates. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
