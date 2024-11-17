const express = require('express');
const { AssemblyAI } = require('assemblyai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const client = new AssemblyAI({
  apiKey: process.env.assembly,
});

app.use(express.json());

app.post('/transcribe', async (req, res) => {
  const { audioUrl } = req.body;

  try {
    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
    });

    res.json({ transcript: transcript.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the audio' });
  }
});

app.listen(5002, () => {
  console.log('AssemblyAI service running on port 5002');
});
