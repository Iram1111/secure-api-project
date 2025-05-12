const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// CSRF protection setup
const csrfProtection = csrf({ cookie: true });

// Rate limit setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests! Try again later."
});
app.use(limiter);

// Helmet for basic security
app.use(helmet());

// API Key protection
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "No entry! Wrong key!" });
  }
  next();
});

// Route to serve a protected form with CSRF token
app.get('/form', csrfProtection, (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <input type="text" name="data" />
      <input type="hidden" name="_csrf" value="${req.csrfToken()}" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// Form submission route (protected by CSRF token)
app.post('/submit', csrfProtection, (req, res) => {
  res.send("Form submitted safely with CSRF protection!");
});

// Sample protected API route
app.get('/api/data', (req, res) => {
  res.json({ message: "🎉 Hello, you got in safely!" });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
