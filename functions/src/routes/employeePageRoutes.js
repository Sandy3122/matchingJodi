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
  if (req.session.employeeToken) {
    // If authenticated, redirect to employee Search route
    return res.redirect("/employee/employee-profile");
  }
  // If not authenticated, redirect to the login page  
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});

// Home Page route
router.get("/dashboard/employee-search", (req, res) => {
  // Check if user is authenticated
  if (!req.session.employeeToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/employee/employee-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});


// Define route to serve employee profile page
router.get('/dashboard/employee-profile', (req, res) => {
  // Check if user is authenticated
  if (!req.session.employeeToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/employee/employee-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'profile.html'));
});

// Define route to serve employee profile page
router.get('/dashboard/getall-employees', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'getAllEmployees.html'));
});

// Define route to serve employee profile page
router.get('/dashboard', (req, res) => {
    // Check if user is authenticated
    if (!req.session.employeeToken) {
      // If not authenticated, redirect to login page
      return res.redirect("/employee/employee-login");
    }
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});


module.exports = router;
