// admin routes
const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');
const { handleAdminLogin, handleAdminLogout } = require('../controllers/adminLoginController');
const { authenticateToken } = require('../utilities/verifyToken'); // Import the authenticateToken middleware
const { getAdminProfile } = require('../controllers/profileController'); // Import the getEmployeeProfile controller


// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

// Admin login route
router.post('/admin-login', handleAdminLogin);

// Admin login route
router.get('/admin-logout', handleAdminLogout);

// Employee profile route (requires authentication)
router.get('/admin-profile', authenticateToken, getAdminProfile);


module.exports = router;
