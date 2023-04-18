const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
// import openaiRouter from "./openaiController"

dotenv.config();

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate-story", async (req, res) => {
  const { prompt } = req.body;
  console.log("prompt: ", prompt);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `${prompt}\n\nGenerated Story:`,
        max_tokens: 1000,
        n: 1,
        stop: null,
        temperature: 1,
        presence_penalty: 1,
        frequency_penalty: 0,
        echo: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log("Checking this data: ", response.data.choices);
    const story = response.data.choices[0].text.trim();
    res.json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    res
      .status(500)
      .json({ error: "Failed to generate story", details: error.message });
  }
});

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  console.log("prompt: ", prompt);
  if (!prompt) {
    return res
      .status(400)
      .json({ error: "Missing prompt in the request body" });
  }
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "800x800",
        model: "image-alpha-001",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log("Generated image data: ", response.data);
    const image = response.data.data[0]?.url;
    res.json({ image });
  } catch (error) {
    console.error("Error generating image:", error);
    res
      .status(500)
      .json({ error: "Failed to generate image", details: error.message });
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
