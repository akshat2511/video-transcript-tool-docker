# Video Transcript Tool

This project is a **Video Transcript Tool** that allows users to upload video files, transcribe their audio content into text using the **AssemblyAI API**, and generate subtitles. Users can also ask questions based on the transcript and receive answers powered by the **Groq AI API**. Additionally, the application integrates **Auth0** for authentication and **Razorpay** for in-app purchases of credits.

## Features

- **Video Upload and Transcription**: Users can upload video files and get their audio transcribed into text.
- **Authentication**: Users can log in securely using Auth0.
- **Subtitle Generation**: Create `.srt` subtitle files from video transcripts.
- **Question Answering**: Ask questions about the transcript and get responses powered by Groq AI.
- **Credit System**: Each user gets an initial set of credits. Credits can be purchased via Razorpay.
- **Dashboard**: View your transcription history and remaining credits.
- **Responsive UI**: Built using **EJS** templates for dynamic and interactive pages.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Auth0
- **APIs**: AssemblyAI, Groq AI
- **Payment Gateway**: Razorpay
- **Templating**: EJS
- **File Handling**: Multer
- **Environment Management**: dotenv

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshat2511/video-transcript-tool.git
   cd video-transcript-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following keys:
   ```env
   assembly=<Your AssemblyAI API Key>
   link=<Your MongoDB Connection String>
   base=<Your Base URL>
   clientid=<Auth0 Client ID>
   dev=<Auth0 Issuer Base URL>
   RAZORPAY_KEY_ID=<Your Razorpay Key ID>
   RAZORPAY_KEY_SECRET=<Your Razorpay Key Secret>
   ```

4. Create an `uploads` folder in the root directory for storing uploaded videos:
   ```bash
   mkdir uploads
   ```

---

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   The app will run on [http://localhost:5000](http://localhost:5000).

2. Visit the landing page and log in via Auth0.

3. Upload a video file to get its audio transcribed.

4. Access your dashboard to view transcription history and purchase credits if needed.

---

## API Endpoints

### Authentication
- `/`: Landing page with login/logout functionality via Auth0.

### Transcription
- `POST /`: Upload a video and receive a transcription.
- `POST /ask`: Ask questions about the transcript.

### Dashboard
- `GET /dash`: View transcription history and credits.

### Payment
- `POST /payment`: Initiate a payment for credits using Razorpay.
- `POST /payment/success`: Handle post-payment success logic.

---

## Folder Structure

```
video-transcript-tool/
│
├── views/               # EJS templates
├── uploads/             # Directory for uploaded video files
├── .env                 # Environment variables
├── app.js               # Main application logic
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

---

## Future Enhancements

- **Support for Additional File Formats**: Enable transcription for audio files.
- **Multi-Language Support**: Allow users to transcribe content in multiple languages.
- **Real-Time Transcription**: Implement live transcription features for streaming videos.
- **Enhanced Dashboard**: Add filters and sorting options for better history management.
- **Rate Limiting**: Prevent abuse by limiting requests based on user credits.

---

## Contribution

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push:
   ```bash
   git commit -m "Add feature"
   git push origin feature-name
   ```
4. Open a pull request on GitHub.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## Contact

- **Author**: Akshat Sahu  
- **GitHub**: [akshat2511](https://github.com/akshat2511)  
- **Email**: akshatsahu@gmail.com
