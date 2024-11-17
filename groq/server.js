const express = require('express');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.groq });

app.use(express.json());

app.post('/ask', async (req, res) => {
  const prompt = req.body.searchQuery;
  const transcript = req.body.transcript;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${prompt} ${transcript}`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 1,
      max_tokens: 1024,
    });

    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

app.listen(5001, () => {
  console.log('Groq SDK service running on port 5001');
});
