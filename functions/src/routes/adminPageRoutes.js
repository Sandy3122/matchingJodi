const router = require('express').Router();
const path = require("path");

// Employee Login route
router.get("/admin-login", (req, res, next) => {
  // Check if user is authenticated
  if (req.session.adminToken) {
    // If authenticated, redirect or any authenticated route
    return res.redirect("/admin/getall-employees");
  }
  // If not authenticated, serve the login page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "adminLogin.html"));
});

// Home Page route
router.get("/getall-employees", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});
// router.get("/getall-employees", (req, res, next) => {
//   // Check if user is authenticated redirect to admin login page    
//   if (!req.session.adminToken) {
//     // If not authenticated, redirect to login page
//     return res.redirect("/admin/admin-login");
//   }
//   // If authenticated, serve the page
//   res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
// });

// Home Page route
router.get("/employee-search", (req, res, next) => {
  // Check if user is authenticated
  if (!req.session.adminToken) {
    // If not authenticated, redirect to login page
    return res.redirect("/admin/admin-login");
  }
  // If authenticated, serve the page
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});

module.exports = router;
