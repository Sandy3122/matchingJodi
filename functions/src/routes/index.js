
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/supportRequest", (req, res) => {
  console.log("Handling /supportRequest route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "aboutUs.html"));
});

module.exports = router;