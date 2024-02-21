const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getEmployeeByPhoneNumber } = require("../models/employeeLoginModel");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleEmployeeLogin: async function (req, res) {
    const { employeePhoneNumber, pin } = req.body;

    try {
      // Fetch employee by phone number
      const employee = await getEmployeeByPhoneNumber(employeePhoneNumber);
      
      if (!employee) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, employee.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: employee.employeeId }, secretKey, { expiresIn: '30m' });

      // Store token in session
      req.session.token = token;

      // Return the token or any other relevant data
      return res.status(200).json({
        message: "Employee Login Successful",
        token 
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Employee Logout route
  handleEmployeeLogout: function(req, res) {
    // Clear the token from the session
    delete req.session.token;

    // Redirect to login page after logout
    res.redirect('/employee/employee-login');
  }
};
