// admin routes
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utilities/verifyToken'); // Import the authenticateToken middleware
const { getAdminProfile } = require('../controllers/profileController'); // Import the getEmployeeProfile controller
const { getEmployeeProfile } = require('../controllers/profileController'); // Import the getEmployeeProfile controller


// Admin profile route (requires authentication)
router.get('/profile', authenticateToken, getAdminProfile);

// Employee profile route (requires authentication)
router.get('/profile', authenticateToken, getEmployeeProfile);



module.exports = router;
