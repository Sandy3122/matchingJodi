const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require('express-session'); // Import express-session
const serviceAccount = require('./serviceAccountKey.json')

dotenv.config();

// Initialize Firebase app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "matchingjodiweb.appspot.com",
  });
}

// Configure express-session before any routes
app.use(session({
  secret: process.env.SESSION_SECRET_KEY, // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000, // Session expires in 30 minutes (30 * 60 * 1000 milliseconds)
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));

// Import routes after initializing express-session
const userRoutes = require("./src/routes/userRoutes");
const employeePageRoutes = require("./src/routes/employeePageRoutes");
const supportRequestFormRoutes = require("./src/routes/supportRequestRoutes");
const employeeRoutes = require('./src/routes/employeeRoutes');
const routes = require('./src/routes/routes');
const adminRoutes = require('./src/routes/adminRoutes');
const adminPageRoutes = require('./src/routes/adminPageRoutes');

app.use("/users", userRoutes);
app.use("/employee", employeePageRoutes);
app.use("/admin", adminPageRoutes);
app.use("/support", supportRequestFormRoutes);
app.use('/api', employeeRoutes);
app.use('/api', adminRoutes);
app.use('/api', routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});


// exports.app = functions.https.onRequest(app);
