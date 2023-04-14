const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
// import openaiRouter from "./openaiController"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `${prompt}\n\nGenerated Story:`,
        max_tokens: 500,
        n: 1,
        stop: null,
        temperature: 0.9,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const story = response.data.choices[0].text.trim();
    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story', details: error.message  });
  }
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
