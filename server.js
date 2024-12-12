require('dotenv').config();

const { analytics } = require('./sources/ga.js');

const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

// Middleware
bodyParser = require('body-parser').json();
app.use(bodyParser);
app.use(cors());

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello from your API!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/analytics', bodyParser, async (req, res) => {
    try {
      response = await analytics(req.body);
      res.json(response);
    } catch (error) {
      res.json({ error: error.message });
    }
});
