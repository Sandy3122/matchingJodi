const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session");

// Configure session middleware
router.use(
  session({
    cookieName: "session",
    secret: "peednasnamhskalramuk9991",
    saveUninitialized: true,
    resave: false,
  })
);

// Define a middleware to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
  // If user is logged in, allow access to the route
  if (req.session.user) {
    next();
  } else {
    // If user is not logged in, redirect to login page
    res.redirect("/employee/employee-login");
  }
};


// Employee Registration route
router.get("/employee-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

// Employee Login route
router.get("/employee-login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
});
// router.get("/employee-login", (req, res) => {
//   if (req.session.user) {
//     res.redirect("/employee/employee-search"); // Redirect to search page if already logged in
//   } else {
//     res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
//   }
// });

// Home Page route
router.get("/employee-search", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeSearch.html"));
});


// Home Page route
router.get("/getall-employees", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "getAllEmployees.html"));
});

module.exports = router;
