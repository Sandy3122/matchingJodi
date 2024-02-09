// MVC Index.js CODE
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
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

const userRoutes = require("./src/routes/userRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const supportRequestFormRoutes = require("./src/routes/supportRequestRoutes");
const employeeRegistrationRoutes = require('./src/routes/employeeRegistrationRoutes');

app.use("/users", userRoutes);
app.use("/employee", employeeRoutes);
app.use("/support", supportRequestFormRoutes);
app.use('/api', employeeRegistrationRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});



// exports.app = functions.https.onRequest(app);
