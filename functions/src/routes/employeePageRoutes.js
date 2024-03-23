// employee page routes

const express = require("express");
const router = express.Router();
const path = require("path");

// Middleware to check if user is an employee
const isEmployee = (req, res, next) => {
  // Check if user is authenticated and the role is employee
  if (req.session && req.session.token && req.session.role !== "admin") {
    // User is authenticated as an employee, proceed to the next middleware
    next();
  } else {
    // User is not authenticated as an employee, redirect to login page
    res.redirect("/api/access-denied");
  }
};

// Employee Registration route
router.get("/employee-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

// A Login route
router.get("/employee-login", (req, res) => {
  // Check if user is authenticated
  if (req.session && req.session.token && req.session.role !== 'admin') {
    // If authenticated and not an admin, redirect to employee dashboard
    return res.redirect("/employee/dashboard");
  }

  // Check if the user is an admin
  if (req.session && req.session.role === 'admin') {
    // If an admin, show an appropriate error message
    return res.status(403).send("Access denied. Other login session is already active");
  }

  // If not authenticated or not an admin, serve the employee login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});

// Define route to serve employee profile page
router.get('/dashboard', isEmployee, (req, res) => {
  // Check if user is authenticated
  if (!req.session.token) {
    // If not authenticated, redirect to login page
    return res.redirect("/employee/employee-login");
  }
  // If authenticated and an employee, serve the main dashboard page
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});


module.exports = router;
