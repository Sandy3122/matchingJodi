// adminLoginController.js
const { getAdminByPhoneNumber } = require("../models/adminLoginModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleAdminLogin: async function(req, res) {
    const { phoneNumber, pin } = req.body;
  
    try {
      // Fetch admin by phone number
      const admin = await getAdminByPhoneNumber(phoneNumber);
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, admin.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Generate JWT token with user type as the role
      const adminToken = jwt.sign({ id: admin.adminId, adminRole: admin.role }, secretKey, { expiresIn: '30m' });

      // Store token in session or response body as needed
      req.session.adminToken = adminToken;
      req.session.adminRole = admin.role;
  
      // Return the token or any other relevant data
      return res.status(200).json({
        message: "Admin Login Successful",
        token: adminToken,
        adminId: admin.adminId, // Include the adminId in the response
        role: req.session.adminRole // Include the role in the response
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },  

  // Admin Logout route
  handleAdminLogout: function(req, res) {
    // Clear the token and role from the session
    delete req.session.adminToken;
    delete req.session.adminRole;

    // Redirect to admin login page after logout
    res.redirect('/admin/admin-login');
  }
};
