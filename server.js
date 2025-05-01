const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Protect with rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests! Try again later."
});
app.use(limiter);

// Add security shields
app.use(helmet());

// Check for secret API key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "No entry! Wrong key!" });
  }
  next();
});

// What to show if the visitor has the right key
app.get('/api/data', (req, res) => {
  res.json({ message: "🎉 Hello, you got in safely!" });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
