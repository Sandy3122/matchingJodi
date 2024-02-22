const express = require("express");
const router = express.Router();
const path = require("path");
const authenticateToken = require("../utilities/employeeAuthMiddleware"); // Import the middleware function


// Route to serve the admin login page
router.get("/employee-login", (req, res) => {
  // Check if user is already authenticated
  if (req.session.token) {
      // If authenticated, redirect to the appropriate page based on the user's role
      return res.redirect("/employee/employee-search"); // For example, redirect to the getAllEmployees page
  }
  // If not authenticated, serve the admin login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});


// Employee Registration route
router.get("/employee-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

// Employee Login route
// router.get("/employee-login", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
// });

// Home Page route
router.get("/employee-search",authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
