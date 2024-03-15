// admin page routes
const router = require('express').Router();
const path = require("path");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.role === "admin") {
    // User is admin, proceed to the next middleware
    next();
  } else {
    // User is not admin, redirect to access-denied route
    res.redirect("/api/access-denied");
  }
};

// Admin Login route
router.get("/admin-login", (req, res, next) => {
  // Check if user is authenticated
  if (req.session.token) {
    // If authenticated, redirect or any authenticated route
    return res.redirect("/admin/dashboard");
  }
  // If not authenticated, serve the login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "admin", "adminLogin.html"));
});

// Define route to serve employee profile page
router.get('/dashboard', (req, res) => {
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

module.exports = router;
