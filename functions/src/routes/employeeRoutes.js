
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/employee-registration", (req, res) => {
  console.log("Handling /employee-registration route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

router.get("/search-employees", (req, res) => {
  console.log("Handling /employee-search route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;