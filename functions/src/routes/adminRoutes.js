const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');

// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

module.exports = router;
