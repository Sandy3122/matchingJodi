const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sessions = require('express-session'); // Import express-session
const serviceAccount = require('./serviceAccountKey.json')


dotenv.config();

// Initialize Firebase app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "matchingjodiweb.appspot.com",
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));

// Configure express-session
// app.use(session({
//   secret: process.env.SESSION_SECRET_KEY, // Change this to a secure random string
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // Set to true to only send cookies over HTTPS
//     maxAge: 24 * 60 * 60 * 1000 // Example: set session expiration time to 1 day
//   },
//   proxy: true // Enable trust proxy
// }));

app.use(
  sessions({
    cookieName: "session",
    secret: "peednasnamhskalramuk9991",
    saveUninitialized: true,
    resave: false,
  })
);


const userRoutes = require("./src/routes/userRoutes");
const employeePageRoutes = require("./src/routes/employeePageRoutes");
const supportRequestFormRoutes = require("./src/routes/supportRequestRoutes");
const employeeRoutes = require('./src/routes/employeeRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use("/users", userRoutes);
app.use("/employee", employeePageRoutes);
app.use("/support", supportRequestFormRoutes);
app.use('/api', employeeRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});


// exports.app = functions.https.onRequest(app);
