const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');
const { handleAdminLogin } = require('../controllers/adminLoginController');

// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

// Admin login route
router.post('/admin-login', handleAdminLogin);

module.exports = router;
