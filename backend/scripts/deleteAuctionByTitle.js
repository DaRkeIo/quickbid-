const axios = require('axios');

const API_URL = 'http://localhost:5002';
const AUCTION_TITLE = 'prasuna';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZlNTQ2MTkzZmNjNjBiMjk1ODA4YTIiLCJpYXQiOjE3NTIwNjM5MjcsImV4cCI6MTc1MjE1MDMyN30.diq5EPaYFkGo-B8cX8ycxLuAZEBzPsPsHWtGCCOE9bA';

(async () => {
  try {
    // Fetch all auctions
    const { data: auctions } = await axios.get(`${API_URL}/auctions`);
    let foundAuction = null;
    auctions.forEach(a => {
      const match = a.title && a.title.toLowerCase() === AUCTION_TITLE.toLowerCase();
      console.log(`ID: ${a._id} | Title: ${a.title}${match ? '  <--- MATCH' : ''}`);
      if (match) foundAuction = a;
    });
    if (!foundAuction) {
      console.log(`No auction found with title '${AUCTION_TITLE}'.`);
      return;
    }
    // Delete the auction with Authorization header
    console.log(`Deleting auction with ID: ${foundAuction._id}`);
    const { data: result } = await axios.delete(`${API_URL}/auctions/${foundAuction._id}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } });
    console.log('Delete result:', result);
  } catch (err) {
    console.error('Error:', err);
    if (err.response) {
      console.error('Error response data:', err.response.data);
      console.error('Error response status:', err.response.status);
      console.error('Error response headers:', err.response.headers);
    }
    if (err.request) {
      console.error('Error request:', err.request);
    }
    if (err.stack) {
      console.error('Error stack:', err.stack);
    }
  }
})(); 