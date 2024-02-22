const express = require("express");
const router = express.Router();
const path = require("path");


// Employee Registration route
router.get("/employee-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

// Employee Login route
router.get("/employee-login", (req, res) => {
  // Check if user is authenticated
  if (req.session.token) {
    // If authenticated, redirect to dashboard or any authenticated route
    return res.redirect("/employee/employee-search"); // Assuming "/employee/dashboard" is the authenticated route for employees
  }
  // If not authenticated, serve the login page  
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});

// Home Page route
router.get("/employee-search", (req, res) => {
  // Check if user is authenticated
  if (!req.session.token) {
    // If not authenticated, redirect to login page
    return res.redirect("/employee/employee-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
