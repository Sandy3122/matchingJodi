// employeeSearchRoutes.js
const express = require('express');
const router = express.Router();
const { searchEmployees } = require('../controllers/employeeSearchController');

router.get('/search-employees', searchEmployees);

module.exports = router;
