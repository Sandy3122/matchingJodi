const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require('axios');
const cors = require('cors');

// Accessing the .env variables
dotenv.config();

// Middleware for json requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cors middleware to handle CORS headers
app.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-requested-with'],
}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/pages'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/supportPage", (req, res) => {
  res.sendFile(__dirname + "/public/pages/aboutUs.html");
});
app.get("/sample", (req, res) => {
  res.sendFile(__dirname + "/public/pages/sample.html");
});

// Msg91 API key and sender ID
const authKey = process.env.MSG91_API_KEY || '381781TbfaDx3JXY658d9c92P1';
const senderID = process.env.MSG91_SENDER_ID || 'MTCJDI';

// Function to send OTP using Msg91
const sendOTP = async (mobileNumber) => {
  try {
    const response = await axios.post(
      'https://api.msg91.com/api/v5/otp',
      {
        authkey: authKey,
        template_id: '634ef8d42225b809261e6324',
        mobile: mobileNumber,
        sender: senderID,
      }
    );

    // Check if 'OTP' is available in the response data
    const otp = response.data && (
      response.data.OTP ||
      (response.data.data && response.data.data.OTP)
    );

    if (!otp) {
      console.error('Error sending OTP: OTP not available in the response data', response.data);
      throw new Error('OTP not available');
    }

    console.log('OTP Sent:', otp);

    return otp;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Route for generating and sending OTP
app.post("/generateOTP", async (req, res) => {
  const { mobileNumber } = req.body;
  console.log(mobileNumber)

  try {
    // Generate and send OTP
    const otpResponse = await sendOTP(mobileNumber);

    res.json({ success: true, message: "OTP sent successfully", data: otpResponse });
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again", error: error.message });
  }
});

// Route for handling the resendOTP request
app.post("/resendOTP", async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    // Resend OTP
    const otpResponse = await sendOTP(mobileNumber);

    res.json({ success: true, message: "OTP resent successfully", data: otpResponse });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ success: false, message: "Failed to resend OTP. Please try again", error: error.message });
  }
});


app.get("/db-ip", async (req, res) => {
  try {
    const response = await axios.get('https://api.db-ip.com/v2/free/self');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from db-ip:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
})