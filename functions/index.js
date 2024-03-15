const express = require("express");
const app = express();
const functions = require("firebase-functions");
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require('express-session'); // Import express-session
const serviceAccount = require('./serviceAccountKey.json')
const path = require("path"); // Import path module to handle file paths

dotenv.config();

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "font-src 'self' data:;"); // Allow fonts to be loaded from the same origin and data URIs
  next();
});


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

app.use(express.static(path.join(__dirname, 'public')));
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
const pageRoutes = require('./src/routes/pageRoutes');
const routes = require('./src/routes/routes');
const adminRoutes = require('./src/routes/adminRoutes');
const adminPageRoutes = require('./src/routes/adminPageRoutes');

app.use("/", userRoutes);
app.use("/employee", employeePageRoutes);
app.use("/admin", adminPageRoutes);
app.use("/support", supportRequestFormRoutes);
app.use('/api', employeeRoutes);
app.use('/api', adminRoutes);
app.use('/api', routes);
app.use('/dashboard', pageRoutes);

app.get('/testing', (req, res) => {
  // Handle the request for /testing here
  res.send('This is the testing page');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});


// exports.app = functions.https.onRequest(app);
