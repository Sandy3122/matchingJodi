// admin routes
const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');
const { handleAdminLogin, handleAdminLogout } = require('../controllers/adminLoginController');
const accessRightsController  = require('../controllers/accessRightsController');

// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

// Admin login route
router.post('/admin-login', handleAdminLogin);

// Admin logout route
router.get('/admin-logout', handleAdminLogout);

// Get all access rights
router.get('/access-rights', accessRightsController.getAllAccessRights);

// Update access right status
router.patch('/access-rights/:accessRightId/status', accessRightsController.updateAccessRightStatus);

// Update access right routes
router.patch('/access-rights/:accessRightId/routes', accessRightsController.updateAccessRightRoutes);

module.exports = router;
