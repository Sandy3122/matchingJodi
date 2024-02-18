// employeeLoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getEmployeeByPhoneNumber } = require("../models/employeeLoginModel"); // Assuming you have a model function to fetch employee by phone number
const secretKey = process.env.SECRET_KEY

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
      const token = jwt.sign({ id: employee.employeeId }, secretKey, { expiresIn: '30m' }); // Replace 'your_secret_key' with your actual secret key

      // Return the token
      return res.status(200).json({
        message: "Employee Login Successful",
        token 
    });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
