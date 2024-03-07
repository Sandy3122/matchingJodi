// admin routes
const express = require('express');
const router = express.Router();
const path = require("path");
const { getUserProfile } = require('../controllers/userProfileController'); // Import the getEmployeeProfile controller
const { authenticateToken } = require('../utilities/verifyToken'); // Import the authenticateToken middleware


// Admin profile route (requires authentication)
// router.get('/profile', authenticateToken, getAdminProfile);

// Employee profile route (requires authentication)
router.get('/profile', authenticateToken, getUserProfile);

// Access Denied Page.
router.get('/access-denied', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessDenied.html'));
});

// Define route to serve employee profile page
router.get('/dashboard/profile', (req, res) => {
    // If authenticated, serve the page
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'profile.html'));
  });
  

  // Home Page route
router.get("/dashboard/employee-search", (req, res) => {
    // If authenticated, serve the page
    res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
  });


// Define route to serve employee profile page
router.get('/dashboard/getall-employees', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'getAllEmployees.html'));
  });


module.exports = router;
