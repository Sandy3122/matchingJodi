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
const employeePageRoutes = require("./src/routes/employeePageRoutes");
const supportRequestFormRoutes = require("./src/routes/supportRequestRoutes");
const employeeRoutes = require('./src/routes/employeeRoutes');

app.use("/users", userRoutes);
app.use("/employee", employeePageRoutes);
app.use("/support", supportRequestFormRoutes);
app.use('/api', employeeRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});



// exports.app = functions.https.onRequest(app);
