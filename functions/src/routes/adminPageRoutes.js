const express = require("express");
const router = express.Router();
const path = require("path");

// Employee Login route
router.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "adminLogin.html"));
});


// Home Page route
router.get("/getall-employees", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});

// Home Page route
router.get("/employee-search", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
