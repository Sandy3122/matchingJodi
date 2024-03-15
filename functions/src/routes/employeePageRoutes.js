// employee page routes

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
    // If authenticated, redirect to employee Search route
    return res.redirect("/employee/dashboard");
  }
  // If not authenticated, redirect to the login page  
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});

// Define route to serve employee profile page
router.get('/dashboard', (req, res) => {
    // Check if user is authenticated
    if (!req.session.token) {
      // If not authenticated, redirect to login page
      return res.redirect("/employee/employee-login");
    }
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});


module.exports = router;
