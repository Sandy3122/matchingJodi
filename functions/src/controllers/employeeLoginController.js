// employeeLoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getEmployeeByPhoneNumber } = require("../models/employeeLoginModel");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleEmployeeLogin: async function (req, res) {
    const { phoneNumber, pin } = req.body;
  
    try {
      // Fetch employee by phone number
      const employee = await getEmployeeByPhoneNumber(phoneNumber);
      
      if (!employee) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Check if account status is active
      if (employee.accountStatus !== 'active') {
        return res.status(401).json({ message: 'Your account is inactive, please contact admin.' });
      }
  
      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, employee.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: employee.employeeId, role: employee.role }, secretKey, { expiresIn: '30m' });
  
      // Store token and role in session
      req.session.token = token;
      req.session.role = employee.role;
      req.session.data = {id:employee.id, name:employee.firstName + " " + employee.lastName, phoneNumber:employee.phoneNumber};
  
      // Return the token or any other relevant data
      return res.status(200).json({
        message: "Employee Login Successful",
        token: token,
        employeeId: employee.employeeId, // Include the employeeId in the response
        role: req.session.role, // Include the role in the response
        data: req.session.data
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
