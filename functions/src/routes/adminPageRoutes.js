// adminPageRoutes.js

const express = require("express");
const router = express.Router();
const path = require("path");
const authenticateToken = require("../utilities/adminAuthMiddleware"); // Import the middleware function

// Route to serve the admin login page
router.get("/admin-login", (req, res) => {
    // Check if user is already authenticated
    if (req.session.token) {
        // If authenticated, redirect to the appropriate page based on the user's role
        return res.redirect("/admin/getall-employees"); // For example, redirect to the getAllEmployees page
    }
    // If not authenticated, serve the admin login page
    res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "adminLogin.html"));
});

// Route to serve the getAllEmployees.html page, redirected to admin login if not authenticated
router.get("/getall-employees", authenticateToken, (req, res) => { // Apply middleware here
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});

// Route to serve the employeeSearch.html page, redirected to admin login if not authenticated
router.get("/employee-search", authenticateToken, (req, res) => { // Apply middleware here
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
