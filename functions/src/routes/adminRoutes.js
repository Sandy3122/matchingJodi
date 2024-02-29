// admin routes
const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');
const { handleAdminLogin, handleAdminLogout } = require('../controllers/adminLoginController');


// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

// Admin login route
router.post('/admin-login', handleAdminLogin);

// Admin login route
router.get('/admin-logout', handleAdminLogout);

module.exports = router;
