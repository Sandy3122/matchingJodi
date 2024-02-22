const { saveAdminData } = require('../models/adminRegistrationModel');
const { checkExistingAdminByEmail, checkExistingAdminByPhoneNumber } = require('../utilities/adminExistenceCheck')
const { generateNumericId } = require("../utilities/generateIds");

module.exports = {
  handleAdminRegistration: async function (req, res) {
    try {
      const { adminName, adminEmail, adminPhoneNumber, pin } = req.body;

      // Check if required fields are provided
      if (!adminName || !adminEmail || !adminPhoneNumber || !pin) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the user already exists with the provided email
      const emailExists = await checkExistingAdminByEmail(adminEmail);
      if (emailExists) {
        return res.status(401).json({ message: "Admin already exists with this email." });
      }
      
      // Check if the user already exists with the provided mobile number
      const mobileNumberExists = await checkExistingAdminByPhoneNumber(adminPhoneNumber);
      if (mobileNumberExists) {
        return res.status(401).json({ message: "Admin already exists with this mobile number." });
      }
        
      const adminId = "admin" + generateNumericId();


      // Save admin data to the database
      const adminData = { 
        adminId,
        adminName,
        adminEmail,
        adminPhoneNumber,
        pin 
      };

      await saveAdminData(adminId, adminData);

      return res.status(201).json({ message: 'Admin data saved successfully'});
    } catch (error) {
      console.error('Error handling admin registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
