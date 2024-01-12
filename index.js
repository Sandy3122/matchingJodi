const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require('axios');

// Accessing the .env variables
dotenv.config();

// Middleware for json requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/pages'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/supportPage", (req, res) => {
  res.sendFile(__dirname + "/public/pages/supportPage.html");
});

// Msg91 API key and sender ID
const authKey = process.env.MSG91_API_KEY || '381781T3dHu7YQ658dc8e8P1';
const senderID = process.env.MSG91_SENDER_ID || 'MTCJDI';


// Function to send OTP using Msg91
const sendOTP = async (mobileNumber) => {
  try {
    const response = await axios.post(
      'https://api.msg91.com/api/v5/otp',
      {
        authkey: authKey,
        template_id: '64f5d570d6fc05297053b862', // Replace with your actual template ID
        mobile: mobileNumber,
        sender: senderID,
      }
    );

    // Handle success
    console.log('OTP Sent:', response.data);

    // Return the response or perform further actions
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error sending OTP:', error.response.data);
    throw error;
  }
};

// Route for sending OTP
app.post("/sendOTP", async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const otpResponse = await sendOTP(mobileNumber);
    res.json({ success: true, message: "OTP sent successfully", data: otpResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});
