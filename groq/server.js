const express = require('express');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');


const cors = require('cors');
dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.groq });

app.use(express.json());

// const cors = require('cors');
app.use(cors({
  origin: '*', // Allow all origins or specify allowed ones
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


app.post('/question', async (req, res) => {

  const prompt = req.body.prompt;
  // import requests
  // var requests = require('requests');
  const Groq = require('groq-sdk');

  const groq = new Groq({ apiKey: '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' });

  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": `${prompt} ${req.body.text}`
      },

    ],
    "model": "llama3-8b-8192",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });

  console.log(chatCompletion.choices[0].message.content);



  // let data = req.oidc.user;

  // const data = await response.json();
  // console.log(response)

  // res.render("logedin.ejs", { userData: data, photo: data.picture, tran: req.body.transcript, ans: chatCompletion.choices[0].message.content });
res.json(chatCompletion.choices[0].message.content);

});

app.listen(5001, () => {
  console.log('Groq SDK service running on port 5001');
});
