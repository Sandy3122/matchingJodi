// general routes
const express = require('express');
const router = express.Router();
const path = require("path");
const { getUserProfile, userLogout } = require('../controllers/userProfileController'); // Import the getEmployeeProfile controller
const { authenticateToken } = require('../utilities/verifyToken'); // Import the authenticateToken middleware


// Employee profile route (requires authentication)
router.get('/profile', authenticateToken, getUserProfile);

// Access Denied Page.
router.get('/access-denied', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessDenied.html'));
});

router.get('/logout', userLogout);

module.exports = router;
