const { AssemblyAI } = require('assemblyai');
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const { auth } = require('express-openid-connect');
const path = require('path');
const { fileURLToPath } = require('url');
const { log } = require('console');
const multer = require('multer');
const bp = require('body-parser');
const razorpay = require('razorpay');

dotenv.config();
const app = express();
// app.use(express.json());
app.use(bp.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const { Schema } = mongoose;
console.log(process.env.link)
mongoose.connect('mongodb+srv://httwarriors12:akshat@cluster0.n9sknas.mongodb.net/hacktt')
const responseSchema = new Schema({
  transcript: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userDetailsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  creditsLeft: {
    type: Number,
    default: 5
  },
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Response'
    }
  ]
});

// Create the Models
const Response = mongoose.model('Response', responseSchema);
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

// module.exports = { UserDetails, Response };


// Set up view engine and paths
app.set('view engine', 'ejs');
// Use path.dirname to get the directory name in CommonJS
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname));

const client = new AssemblyAI({
  apiKey: process.env.assembly
});

// let transcript = await client.transcripts.transcribe({
//     audio: "./videoplayback1.mp4", language_code:"hi"
// });
// const params = {
//     audio: audioUrl,
//     language_code: 'hi'
// };

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:5000',
  clientID: 'EivGZZRWyXiAhDX7Viafs8b9vaafvdct',
  issuerBaseURL: 'https://dev-ktrnto3xhx5pfgg2.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
// console.log('Base URL:', process.env.dev, config);

app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', async (req, res) => {
  try {
    // Check if the user is authenticated
    let verified = req.oidc.isAuthenticated();

    if (!verified) {
      // If not authenticated, render the landing page
      return res.render("land.ejs");
    }

    // Get user information
    let data = req.oidc.user;
    let photo = data.picture;

    // Check user's credits
    const userDetails = await UserDetails.findOne({ email: data.email });

    if (!userDetails || userDetails.creditsLeft <= 0) {
      // Redirect to /dash if credits are insufficient
      return res.redirect("http://localhost:5000/dash");
    }

    // Retrieve the transcript from the query parameter
    let transcript = req.query.transcript || 'Transcription will be available once the video has been processed.';
    if (req.query.transcript) {
      let x = new Response({ transcript: req.query.transcript, date: new Date() });
      await x.save();

      // Update user's responses and decrement credits
      await UserDetails.findOneAndUpdate(
        { email: data.email },
        { $push: { responses: x }, $inc: { creditsLeft: -1 } }
      );
    }

    // Render the logged-in page with the transcript
    res.render("logedin.ejs", {
      userData: data,
      photo: photo,
      tran: transcript,
      ans: " "
    });
  } catch (error) {
    console.error("Error handling / route:", error);
    res.status(500).send("Internal Server Error");
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload directory (ensure it exists or create it)
  },
  filename: (req, file, cb) => {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //   cb(null, 'akshat'); // Generate a unique name
    const extension = path.extname(file.originalname); // Get file extension
    cb(null, `akshat${extension}`);
  }
});

// Initialize multer with storage settings
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});



// Define the route to handle video upload
app.post('/', upload.single('videoFile'), async (req, res) => {
  if (req.file) {
    let transcript = await client.transcripts.transcribe({
      audio: './uploads/akshat.mp4',
    });
    console.log(transcript);
    let data = req.oidc.user;
    let x = new Response({ transcript: transcript.text, date: new Date() });
    await x.save();
    console.log(x);
    let m = await UserDetails.findOneAndUpdate({ email: data.email }, { $push: { responses: x }, $inc: { creditsLeft: -1 } })

    res.render("logedin.ejs", { userData: data, photo: data.picture, tran: transcript.text, ans: " " });





  } else {
    res.status(400).json({ error: 'Please upload a valid video file.' });
  }
});
app.post('/ask', async (req, res) => {

  let data = req.oidc.user;
  console.log(req.body.transcript);

  res.render("logedin.ejs", { userData: data, photo: data.picture, tran: req.body.transcript, ans: " " });






});
app.post('/question', async (req, res) => {

  const prompt = req.body.searchQuery;
  // import requests
  // var requests = require('requests');
  // const Groq = require('groq-sdk');

  // const groq = new Groq({ apiKey: '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' });

  // const chatCompletion = await groq.chat.completions.create({
  //   "messages": [
  //     {
  //       "role": "user",
  //       "content": `${prompt} ${req.body.transcript}`
  //     },

  //   ],
  //   "model": "llama3-8b-8192",
  //   "temperature": 1,
  //   "max_tokens": 1024,
  //   "top_p": 1,
  //   "stream": false,
  //   "stop": null
  // });

  // console.log(chatCompletion.choices[0].message.content);


  let data = req.oidc.user;

  try {
    const response = await fetch('http://host.docker.internal:5001/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: req.body.transcript,
        prompt: prompt,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    var result = await response.json();
    // console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }

  // const data = await response.json();
  // console.log(response)

  res.render("logedin.ejs", { userData: data, photo: data.picture, tran: req.body.transcript, ans: result });


});
app.get('/dash', async (req, res) => {
  let data = req.oidc.user; const user = await UserDetails.findOne({ email: data.email }).populate('responses');
  res.render("dash", { user, data, options: false })
})


// app.post('/',upload.single('videoFile'),(req, res) => {
//     res.redirect('/')


// });


const createSubtitle = (words) => {
  const formatTime = (timeInMs) => {
    const date = new Date(timeInMs);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(timeInMs % 1000).padStart(3, '0');
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  };

  let subtitles = '';

  words.forEach((word, index) => {
    const start = formatTime(word.start);
    const end = formatTime(word.end);
    subtitles += `${index + 1}\n${start} --> ${end}\n${word.text}\n\n`;
  });

  return subtitles;
};

const saveSubtitleToFile = (subtitles, filename) => {
  fs.writeFileSync(filename, subtitles);
  console.log(`Subtitle file saved as ${filename}`);
};

// const words = transcript.words;
// const subtitles = createSubtitle(words);
// saveSubtitleToFile(subtitles, 'subtitles.srt');

// console.log(transcript);
// app.post('/:ak/:lang', async (req, res) => {
//   const ak = req.params.ak;
//   const lang = req.params.lang;
//   let transcript = await client.transcripts.transcribe({
//     audio: ak, language_code: en
//   });
//   const subtitles = createSubtitle(transcript.words);
//   saveSubtitleToFile(subtitles, 'subtitles.srt');
//   const subtitleFile = fs.readFileSync('subtitles.srt');  // Fix the file read path
//   res.json(transcript);
// });





const { instance, validateSignature } = require("./razorpay");



app.post("/payment", async (req, res) => {
  const { plan } = req.body;
  let totalAmount = 0;
  let credit = 0;
console.log(req.body);

  if (plan == "basic") {
    totalAmount = 100;
    credit = 10;
  } else if (plan == "standard") {
    totalAmount = 160;
    credit = 20;
  } else {
    totalAmount = 210;
    credit = 30;
  }

  const options = {
    amount: totalAmount * 100, // Amount in paise
    currency: "INR",
    receipt: `receipt_${Math.floor(Math.random() * 10000000)}`,
  };

  try {
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred");

    const responseOptions = {
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount.toString(),
      currency: order.currency,
      name: req.oidc?.user?.name || "Guest User",
      description: "Credit Purchase",
      image: "https://lh3.googleusercontent.com/a/AGNmyxYVPmzybxNWLF3EU5ELKmkFYKJqbAp0mpA28GSAaA=s200-c",
      order_id: order.id,
      prefill: {
        email: req.oidc?.user?.email || "example@example.com",
        contact: "6387488465",
      },
      theme: { color: "#2094f3" },
      credit: credit,
    };
console.log(responseOptions);

    res.status(200).send(responseOptions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Razorpay order");
  }
});

app.post("/payment/success", async (req, res) => {
  const { email, credit ,razorpayPaymentId, orderCreationId, razorpaySignature} = req.body;

  console.log(req.body);
  if (!validateSignature(razorpayPaymentId, orderCreationId, razorpaySignature)) {
    return res.status(400).json({ msg: "Transaction not legit!" });
  }


 let ak= await UserDetails.findOneAndUpdate({ email: email }, { $inc: { creditsLeft: credit } });
console.log(ak);

  res.status(200).json({
    success: true, message: "Order Placed Successfully!",
    orderId: orderCreationId,
    paymentId: razorpayPaymentId
  });
});




app.listen(5000, () => { console.log("listening on http://localhost:5000"); });