const router = require('express').Router();
const path = require("path");

// Employee Login route
router.get("/admin-login", (req, res, next) => {
  // Check if user is authenticated
  if (req.session.adminToken) {
    // If authenticated, redirect or any authenticated route
    return res.redirect("/admin/admin-profile");
  }
  // If not authenticated, serve the login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "adminLogin.html"));
});

// Home Page route
router.get("/dashboard/getall-employees", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});

// Define route to serve admin profile page
router.get('/dashboard/admin-profile', (req, res) => {
  // Check if user is authenticated
  if (!req.session.adminToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'profile.html'));
});


// Home Page route
router.get("/dashboard/employee-search", (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.adminToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});


// Define route to serve employee profile page
router.get('/dashboard', (req, res) => {
  // Check if user is authenticated
  if (!req.session.adminToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});

module.exports = router;
