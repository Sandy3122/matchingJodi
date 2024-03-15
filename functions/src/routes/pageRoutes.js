const express = require('express');
const router = express.Router();
const path = require("path");

const admin = require('firebase-admin');
const db = admin.firestore();

// Middleware to check access rights
router.use(async (req, res, next) => {
  try {
      const accessRights = await getAllAccessRights();
      const role = req.session.role; // Assuming role is stored in session

      // If the role is admin, grant access to all routes
      if (role === 'admin') {
          return next(); // Continue to the requested route
      }

      // Define the route name based on request path
      const routeName = req.path;

      // Check if access is allowed
      const hasAccess = accessRights.some(access => {
          return access.role === role && access.status === 'active' && access.routeName.includes(routeName);
      });

      if (hasAccess) {
          next(); // Continue to the requested route
      } else {
          res.redirect('/api/access-denied'); // Redirect to access denied route
      }
  } catch (error) {
      console.error("Error fetching access rights:", error);
      res.status(500).json({ error: "Internal server error." });
  }
});

// Function to get all access rights from the database
async function getAllAccessRights() {
    const snapshot = await db.collection('accessRights').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


// Serve employee profile page
router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'profile.html'));
});

// Serve employee search page
router.get("/employee-search", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'employeeSearch.html'));
});

// Serve all employees page
router.get('/getall-employees', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'getAllEmployees.html'));
});

// route to serve access rights page
router.get('/access-rights', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessRights.html'));
});
  
// route to reset employee passwords
router.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'resetEmployeePasswords.html'));
});






module.exports = router;
