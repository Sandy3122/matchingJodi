// employeeRegistrationRoute.js
const express = require('express');
const router = express.Router();
const { handleEmployeeRegistration } = require('../controllers/employeeRegistrationController');

router.post('/employee-registration', handleEmployeeRegistration);

module.exports = router;