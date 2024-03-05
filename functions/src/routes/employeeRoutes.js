const express = require('express');
const router = express.Router();
const { handleEmployeeRegistration } = require('../controllers/employeeRegistrationController');
const { searchEmployees } = require('../controllers/employeeSearchController');
const { getAllEmployees } = require('../controllers/getAllEmployees');
const { updateEmployeeStatus, updateRole } = require('../controllers/employeeStatusController');
const { handleEmployeeLogin, handleEmployeeLogout } = require('../controllers/employeeLoginController');

// Employee registration route
router.post('/employee-registration', handleEmployeeRegistration);

// Search employees route (requires authentication)
router.get('/employee-search', searchEmployees);

// Get all employees route (requires authentication)
router.get('/getall-employees', getAllEmployees);

// Update employee status route (requires authentication)
router.patch('/employee-status/:employeeId', updateEmployeeStatus);

// Update employee role route (requires authentication)
router.patch('/updateRole/:employeeId', updateRole);

// Login route
router.post('/employee-login', handleEmployeeLogin);

// Logout route
router.get('/employee-logout', handleEmployeeLogout);

module.exports = router;
