// userRegistrationController.js

const { saveUserRegistrationData } = require("../models/userRegistrationModel"); // Import user registration model
const {
  checkExistingByEmail,
  checkExistingByPhoneNumber,
} = require("../utilities/userExistenceCheck");
const bcrypt = require("bcryptjs");
const { generateNumericId } = require("../utilities/generateIds");
const jwt = require("jsonwebtoken");
// Define secret key for JWT
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleUserRegistration: async function (req, res) {
    const {
      firstName,
      lastName,
      gender,
      profileFor,
      email,
      phoneNumber,
      pin,
    } = req.body;
    console.log(req.body);
    try {

      const userId = "app" + generateNumericId();
      const timestamp = new Date(); // Create a new Date object to represent the current timestamp

      // Check if a user with the provided email already exists
      const emailExists = await checkExistingByEmail(email, "user");
      if (emailExists) {
        return res
          .status(401)
          .json({ message: "User already exists with this email." });
      }

      // Check if a user with the provided phone number already exists
      const phoneExists = await checkExistingByPhoneNumber(phoneNumber, "user");
      if (phoneExists) {
        return res
          .status(401)
          .json({ message: "User already exists with this phone number." });
      }

      // Hash the pin/password
      const hashedPin = await bcrypt.hash(pin, 10);
      console.log("pin", hashedPin)





      // Convert relevant fields to lowercase
      const lowerCaseFirstName = firstName ? firstName.toLowerCase().trim() : '';
      const lowerCaseLastName = lastName ? lastName.toLowerCase().trim() : '';
      const lowerCaseGender = gender ? gender.toLowerCase().trim() : '';
      const lowerCaseEmail = email ? email.toLowerCase().trim() : '';
      const lowerCaseProfileFor = profileFor ? profileFor.toLowerCase().trim() : '';
      const generatedCustomerId = generateNumericId();




      // Prepare user data object
      const userData = {
        firstName: lowerCaseFirstName,
        lastName: lowerCaseLastName,
        gender: lowerCaseGender,
        profileFor: lowerCaseProfileFor,
        email: lowerCaseEmail,
        phoneNumber: phoneNumber,
        pin: hashedPin,
        termsAndConditions: req.body.termsAndConditions || "",
        customerId: generatedCustomerId,
        registeredById: req.session?.data?.id,
        registeredByName: req.session?.data?.name,
        registeredByNumber: req.session?.data?.phoneNumber,
        accountCreatedDateTime: timestamp,
        dateOfBirth: req.body.dateOfBirth || "",
        maritalStatus: req.body.maritalStatus || "",
        religion: req.body.religion || "",
        kyc: req.body.kyc || "",
        documentFront: req.body.documentFrontUrl || "",
        documentBack: req.body.documentBackUrl || "",
        imgList: Array(5).fill({
          imgLink: "",
          verificationBy: "",
          verificationDate: "",
          verified: "no",
        }), // Array of objects with the specified fields
        currentAddress: {
          city: "",
          country: "",
          state: "",
          town: ""
        },
        permanentAddress: {
          city: "",
          country: "",
          state: "",
          town: ""
        },
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
        noOfBrother: req.body.noOfBrother || "",
        noOfSister: req.body.noOfSister || "",
        brotherMarried: req.body.brotherMarried || "",
        sisterMarried: req.body.sisterMarried || "",
        primaryGuardian: {
          name: req.body.name || "",
          relation: req.body.relation || "",
          phoneNumber: req.body.phoneNumber || "",
          workingWith: req.body.workingWith || ""
        },
        secondaryGuardian: {
          name: req.body.name || "",
          relation: req.body.relation || "",
          phoneNumber: req.body.phoneNumber || "",
          workingWith: req.body.workingWith || ""
        }
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
        .json({ message: "Error uploading files or saving data" });
    }
  },
};
