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
  
      // Generate JWT token with user type as 'admin'
      const token = jwt.sign({ id: admin.id, userType: 'admin' }, secretKey, { expiresIn: '30m' });

      // Store token in session or response body as needed
      req.session.token = token;
  
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

  // Admin Logout route (if needed)
  handleAdminLogout: function(req, res) {
    // Clear the token from the session or any other storage mechanism used
    delete req.session.token;

    // Redirect or send response as needed
    res.redirect('/admin/admin-login');
  }
};
