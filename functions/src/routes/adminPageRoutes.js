// admin page routes
const router = require('express').Router();
const path = require("path");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.token && req.session.role === "admin") {
    // User is admin, proceed to the next middleware
    next();
  } else {
    // User is not admin, redirect to access-denied route
    res.redirect("/admin/admin-login");
  }
};

// Admin Login route
router.get("/admin-login", (req, res, next) => {
  // Check if user is authenticated
  if (req.session && req.session.token && req.session.role === 'admin') {
    // If authenticated, redirect or any authenticated route
    return res.redirect("/admin/dashboard");
  }
  if (req.session && req.session.token && req.session.role !== 'admin') {
    // If an admin, show an appropriate error message
    return res.status(403).send("Access denied. Other login session is already active");
  }
  // If not authenticated, serve the login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "admin", "adminLogin.html"));
});

// Define route to serve employee profile page
router.get('/dashboard', isAdmin, (req, res) => {
    // Check if user is authenticated
    if (!req.session.token) {
      // If authenticated, redirect or any authenticated route
      return res.redirect("/admin/admin-login");
    }
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});

// Define route to serve access rights page
router.get('/access-rights', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessRights.html'));
});

// Define route to reset employee passwords
router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'resetEmployeePasswords.html'));
});

// Access denied route
router.get("/access-denied", (req, res) => {
  res.status(403).send("Access denied");
});

// route to Add users
router.get('/user-registration', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userRegistration.html'));
});


module.exports = router;
