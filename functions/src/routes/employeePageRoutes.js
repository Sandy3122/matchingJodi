
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/employee-registration", (req, res) => {
  console.log("Handling /employee-registration route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

router.get("/employee-search", (req, res) => {
  console.log("Handling /employee-search route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

router.get("/employee-login", (req, res) => {
  console.log("Handling /employee-search route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});

module.exports = router;