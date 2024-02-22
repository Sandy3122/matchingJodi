const router = require('express').Router();
const path = require("path");

// Employee Login route
router.get("/admin-login", (req, res, next) => {
  // Check if user is authenticated
  if (req.session.token) {
    // If authenticated, redirect to dashboard or any authenticated route
    return res.redirect("/admin/getall-employees"); // Assuming "/admin/dashboard" is the authenticated route
  }
  // If not authenticated, serve the login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "adminLogin.html"));
});

// Home Page route
router.get("/getall-employees", (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.token) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});

// Home Page route
router.get("/employee-search", (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.token) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
