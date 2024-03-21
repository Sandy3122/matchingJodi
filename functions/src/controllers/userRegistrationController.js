const { saveUserRegistrationData } = require("../models/userRegistrationModel"); // Import user registration model
const {
  checkExistingByEmail,
  checkExistingByPhoneNumber,
} = require("../utilities/userExistenceCheck");
const bcrypt = require("bcryptjs");
const { generateNumericId } = require("../utilities/generateIds");
const jwt = require('jsonwebtoken');
// Define secret key for JWT
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleUserRegistration: async function (req, res) {
    try {
      const {
        firstName,
        lastName,
        gender,
        profileFor,
        email,
        phoneNumber,
        pin,
      } = req.body;

      const userId = "app" + generateNumericId();
      const timestamp = new Date(); // Create a new Date object to represent the current timestamp

      // Check if a user with the provided email already exists
      const emailExists = await checkExistingByEmail(email, 'user');
      if (emailExists) {
        return res
          .status(401)
          .json({ message: "User already exists with this email." });
      }

      // Check if a user with the provided phone number already exists
      const phoneExists = await checkExistingByPhoneNumber(phoneNumber, 'user');
      if (phoneExists) {
        return res
          .status(401)
          .json({ message: "User already exists with this phone number." });
      }

      // Hash the pin/password
      const hashedPin = await bcrypt.hash(pin, 10);

      // Prepare user data object
      const userData = {
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        gender: gender.trim().toLowerCase(),
        profileFor: profileFor.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        pin: hashedPin,
        termCondition: req.body.termCondition || "",
        customerId: req.body.customerId || "",
        registeredById: req.session.data.id,
        registeredByName: req.session.data.name,
        registeredByNumber: req.session.data.phoneNumber,
        accountCreatedDateTime: timestamp,
        dateOfBirth: req.body.dateOfBirth || "",
        maritialStatus: req.body.maritialStatus || "",
        religion: req.body.religion || "",
        kyc: req.body.kyc || "",
        documentFrontUrl: req.body.documentFrontUrl || "",
        documentBackUrl: req.body.documentBackUrl || "",
        imgListUrls: Array(5).fill({
            imgLink: "",
            verification_by: "",
            verification_date: "",
            verified: "no"
          }), // Array of objects with the specified fields
        currentAddress: req.body.currentAddress || "",
        permanentAddress: req.body.permanentAddress || "",
        height: req.body.height || "",
        bodyType: req.body.bodyType || "",
        dietType: req.body.dietType || "",
        smoke: req.body.smoke || "",
        drink: req.body.drink || "",
        language: req.body.language || "",
        educationLevel: req.body.educationLevel || "",
        educationField: req.body.educationField || "",
        workingWith: req.body.workingWith || "",
        designation: req.body.designation || "",
        annualIncome: req.body.annualIncome || "",
        caste: req.body.caste || "",
        subCaste: req.body.subCaste || "",
        manglik: req.body.manglik || "",
        rashi: req.body.rashi || "",
        timeOfBirth: req.body.timeOfBirth || "",
        birthPlace: req.body.birthPlace || "",
      };

      // Save user data to the database
      await saveUserRegistrationData(userId, userData);

      // Generate JWT token
      const token = jwt.sign({ userId }, secretKey, { expiresIn: "30m" });

      // Send response with token
      return res
        .status(200)
        .json({ message: "Data sent successfully.", token });
    } catch (error) {
      console.error("Error uploading files or saving data:", error);
      return res
        .status(500)
        .json({ error: "Error uploading files or saving data" });
    }
  },
};
