const express = require("express");
const app = express();
const axios = require('axios');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});
