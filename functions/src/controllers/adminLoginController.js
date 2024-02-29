// admin login controller
const { getAdminByPhoneNumber } = require("../models/adminLoginModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleAdminLogin: async function(req, res) {
    const { adminPhoneNumber, pin } = req.body;
  
    try {
      // Fetch admin by phone number
      const admin = await getAdminByPhoneNumber(adminPhoneNumber);
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, admin.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Determine user role (e.g., admin, employee, user)
      const role = 'admin'; // Assign admin role for now
      
      // Generate JWT token with user type as the role
      const token = jwt.sign({ id: admin.id, role: role }, secretKey, { expiresIn: '30m' });

      // Store token in session or response body as needed
      req.session.adminToken = token;
  
      // Return the token or any other relevant data
      return res.status(200).json({
        message: "Admin Login Successful",
        token 
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },  

  // Admin Logout route
handleAdminLogout: function(req, res) {
  // Clear the adminToken from the session
  delete req.session.adminToken;

  // Redirect to admin login page after logout
  res.redirect('/admin/admin-login');
}

};
