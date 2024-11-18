const express = require('express');
const { AssemblyAI } = require('assemblyai');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const app = express();

dotenv.config();
app.use(cors({
  origin: '*', // Allow all origins or specify allowed ones
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
const client = new AssemblyAI({
  apiKey: '3ec7b601debf42f584c558d73a58753b',
});

app.use(express.json());
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
const path = require('path'); // For path manipulation
const fs = require('fs'); // For file system operations

app.post('/', upload.single('videoFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a valid video file.' });
    }

    // Dynamic file path for the uploaded file
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    // Transcribe the uploaded audio/video file
    const transcript = await client.transcripts.transcribe({
      audio: filePath,
    });

    console.log("Transcripted");

    // Save transcript in session
    // req.session.data = { transcript: transcript.text };

    const transcriptText = encodeURIComponent(transcript.text); // URL-encode the data
return res.redirect(`http://localhost:5000/?transcript=${transcriptText}`);

  } catch (error) {
    console.error("Error during transcription:", error);

    // Handle errors and respond with a 500 status code
    res.status(500).json({ error: 'An error occurred during transcription.' });
  } 
});


app.listen(5002, () => {
  console.log('AssemblyAI service running on port 5002');
});
