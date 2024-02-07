const express = require("express");
const app = express();
const functions = require("firebase-functions");
const config = functions.config();
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const {v4: uuidv4} = require("uuid");
const path = require("path");

// Firebase Admin SDK initialization
const serviceAccount = require("./serviceAccountKey.json");

// Initialize firebaseConfig object
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
};

// Initialize Firebase Admin SDK
admin.initializeApp(firebaseConfig);


// Allow specific headers in CORS response
app.use(
  cors({
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      // Add any other headers you need to allow
    ],
  })
);

// Accessing the .env variables
dotenv.config();

// Middleware for json requests
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json()); // Use body-parser middleware
app.use(bodyParser.urlencoded({extended: true})); // Use body-parser middleware

// Use cors middleware to handle CORS headers
app.use(
  cors({
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    exposedHeaders: ["x-requested-with"],
  }),
);


// making folders to public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "pages")));

app.get("/", (req, res) => {
  console.log("Handling / route");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/supportRequest", (req, res) => {
  console.log("Handling /supportRequest route");
  res.sendFile(path.join(__dirname, "public", "aboutUs.html"));
});


app.get("/env", (req, res) => {
  res.json({
    WIDGET_ID: process.env.WIDGET_ID,
    TOKEN_AUTH: process.env.TOKEN_AUTH,
  });
});


// Function to generate a numeric-only ID from a UUID
function generateNumericId() {
  const uuid = uuidv4();
  const numericId = parseInt(uuid.replace(/[^0-9]/g, ""), 10);
  return numericId.toString().substring(0, 7);
}

// Route to handle posting user details to Firebase
app.post("/sendData", async (req, res) => {
  console.log("Testing");
  try {
    // Retrieving user details from the request body
    const {phone, name, email, message} = req.body;

    // Validate the input fields as needed
    if (!(phone && name && email && message)) {
      return res.status(400).json({error: "Please fill in all fields."});
    }

    const customId = "w" + generateNumericId();

    // Set the default status to "pending"
    const status = "pending";

    // Include a timestamp
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Saving the user data to Firestore Database with the custom ID
    await admin.firestore().collection("usersData").doc(customId).set({
      phone,
      name,
      email,
      message,
      timestamp,
      status,
    });

    res.status(200).json({message: "Data sent successfully."});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

// console.log(process.env.PORT);
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});

// exports.app = functions.https.onRequest(app);
