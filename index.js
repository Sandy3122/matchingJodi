const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');



// Firebase Admin SDK initialization
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Accessing the .env variables
dotenv.config();

// Middleware for json requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cors middleware to handle CORS headers
app.use(
  cors({
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "x-requested-with",
    ],
  })
);

// Use cookie parser middleware
app.use(cookieParser());

// making folders to public
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/pages"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/supportRequest", (req, res) => {
  res.sendFile(__dirname + "/public/pages/aboutUs.html");
});

app.get("/env", (req, res) => {
  res.json({
    WIDGET_ID: process.env.WIDGET_ID,
    TOKEN_AUTH: process.env.TOKEN_AUTH,
  });
});


// Counter for generating sequential IDs
let counter = 0;

// Route to handle posting user details to Firebase
app.post("/sendData", async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received Data:", req.body);

    // Retrieving user details from the request body
    const { phone, name, email, message } = req.body;

    // Validate the input fields as needed
    if (!(phone && name && email && message)) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

    // Increment counter for generating sequential IDs
    counter += 1;

    // Generate a sequential ID like "w1," "w2," ...
    const sequentialId = `w${counter}`;

    // Include a timestamp
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Set a default status
    const defaultStatus = "pending";

    // Saving the user data to Firestore Database with the custom ID
    await admin.firestore().collection("usersData").doc(sequentialId).set({
      phone,
      name,
      email,
      message,
      timestamp,
      status: defaultStatus,
    });

    res.status(200).json({ message: "Data sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});
