// openaiController.js
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const openaiRouter = express.Router();

const configuration = new Configuration({
  organization: 'org-JrThiulxcKjNwxcNJvWKTr1V',
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

openaiRouter.get('/list-engines', async (req, res) => {
  try {
    const response = await openai.listEngines();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default openaiRouter;
