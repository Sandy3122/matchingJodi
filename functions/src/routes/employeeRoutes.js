// employeeRoutes.js
const express = require('express');
const router = express.Router();
const { handleEmployeeRegistration } = require('../controllers/employeeRegistrationController');
const { searchEmployees } = require('../controllers/employeeSearchController');
const { handleEmployeeLogin } = require('../controllers/employeeLoginController')


// Employee registration route
router.post('/employee-registration', handleEmployeeRegistration);

// Search employees route
router.get('/employee-search', searchEmployees);

// Get all employees route (assuming it's the same as search)
router.get('/getall-employees', searchEmployees);

// Login route
router.post('/employee-login', handleEmployeeLogin);

module.exports = router;
