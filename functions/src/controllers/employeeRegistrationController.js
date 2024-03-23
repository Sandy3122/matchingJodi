// Import necessary modules
const multer = require("multer");
const { saveEmployeeRegistrationData } = require("../models/employeeRegistrationModel");
const { generateNumericId } = require("../utilities/generateIds");
const admin = require("firebase-admin");
const sharp = require("sharp");
const bcrypt = require('bcryptjs');
const { PDFDocument } = require('pdf-lib');
const jwt = require('jsonwebtoken');
const { checkExistingByEmail, checkExistingByPhoneNumber } = require("../utilities/userExistenceCheck");
const allEmployeeRoutes = require("../routes/employeeRoutes"); // Import employee routes

// Define secret key for JWT
const secretKey = process.env.SECRET_KEY;

// Initialize Firebase storage bucket
const bucket = admin.storage().bucket();

// Initialize multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for file size
});

// Function to compress image files
async function compressImage(file) {
  return sharp(file.buffer)
    .resize({ width: 600 }) // Resize to a maximum width of 600 pixels
    .jpeg({ quality: 70 }) // Compress and convert to JPEG format with 70% quality
    .toBuffer();
}

// Function to compress PDF files
async function compressPDF(file) {
  const pdfDoc = await PDFDocument.load(file.buffer);
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Function to compress various types of files
async function compressFile(file, fileType) {
  if (fileType === "application/pdf") {
    return compressPDF(file);
  } else if (fileType.startsWith("image/")) {
    return compressImage(file);
  } else {
    return file.buffer;
  }
}

// Function to upload file to Firebase storage
async function uploadFile(file, folder, employeeId, fileType, kycDocumentType) {
  try {
    const compressedBuffer = await compressFile(file, file.mimetype);

    if (compressedBuffer.length === 0) {
      throw new Error("Empty file buffer after compression");
    }

    const documentName = fileType === "employeeProfilePic" ? "profile_pic" :
      fileType === "employeeResume" ? "resume" :
      `${kycDocumentType}`;

    const fileName = `${employeeId}_${documentName}.${file.originalname.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;

    const fileUpload = bucket.file(filePath);

    // Create the file
    const fileStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    await new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      fileStream.on("finish", () => {
        fileUpload.makePublic()
          .then(() => resolve(fileUpload.publicUrl()))
          .catch((error) => reject(error));
      });
      fileStream.end(compressedBuffer);
    });

    return fileUpload.publicUrl();
  } catch (error) {
    throw error;
  }
}

// Controller function to handle employee registration
module.exports = {
  handleEmployeeRegistration: async function (req, res) {
    // Handle file upload and form data parsing
    upload.fields([
      { name: "employeePhoto", maxCount: 1 },
      { name: "employeeResume", maxCount: 1 },
      { name: "kycDocument", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        // Handle file upload errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("File size limit exceeded (max 2MB)");
        }
        console.error("Error uploading files:", err);
        return res.status(500).send("Error uploading files");
      }

      const files = req.files;

      // Check if any files were uploaded
      if (!files || !files.employeePhoto || !files.employeeResume || !files.kycDocument) {
        return res.status(400).send("Files not uploaded");
      }

      const employeeId = "e" + generateNumericId();

      const {
        firstName,
        lastName,
        gender,
        birthday,
        maritalStatus,
        email,
        phoneNumber,
        emergencyPhoneNumber,
        pin,
        kycDocumentType,
        role,
        designation,
        joiningDate,
        accountStatus,
      } = req.body;

      // Ensure the employee's folder exists
      const employeeFolder = `employees/${employeeId}`;

      try {
        // Check if the user already exists with the provided email
        const emailExists = await checkExistingByEmail(email, 'employee');
        if (emailExists) {
          return res.status(401).json({ message: "User already exists with this email." });
        }
        
        // Check if the user already exists with the provided mobile number
        const mobileNumberExists = await checkExistingByPhoneNumber(phoneNumber, 'employee');
        if (mobileNumberExists) {
          return res.status(401).json({ message: "User already exists with this mobile number." });
        }
        
        const timestamp = new Date(); // Create a new Date object to represent the current timestamp

        // Hash the pin/password
        const hashedPin = await bcrypt.hash(pin, 10);

        // Convert relevant fields to lowercase
        const lowerCaseFirstName = firstName.toLowerCase().trim();
        const lowerCaseLastName = lastName.toLowerCase().trim();
        const lowerCaseGender = gender.toLowerCase().trim();
        const lowerCaseemail = email.toLowerCase().trim();
        const lowerCaseKycDocumentType = kycDocumentType.toLowerCase().trim();
        const lowerCaseMaritalStatus = maritalStatus.toLowerCase().trim();

        // Prepare employee data object
        const employeeData = {
          firstName: lowerCaseFirstName,
          lastName: lowerCaseLastName,
          gender: lowerCaseGender,
          maritalStatus: lowerCaseMaritalStatus,
          birthday,
          timestamp,
          employeeId,
          email: lowerCaseemail,
          phoneNumber,
          emergencyPhoneNumber,
          pin: hashedPin,
          kycDocumentType: lowerCaseKycDocumentType,
          role: role || "user",
          designation: designation || "Employee",
          joiningDate: joiningDate ? new Date(joiningDate) : timestamp,
          accountStatus: accountStatus || "inactive",
          routeAccess: allEmployeeRoutes // Default route access to all employee routes
        };

        // Upload files to storage and get their public URLs
        const photoUrl = await uploadFile(files.employeePhoto[0], employeeFolder, employeeId, "employeeProfilePic");
        const resumeUrl = await uploadFile(files.employeeResume[0], employeeFolder, employeeId, "employeeResume");
        const kycDocumentUrl = await uploadFile(files.kycDocument[0], employeeFolder, employeeId, "kycDocument", kycDocumentType);

        // Add file URLs to employee data object
        employeeData.photoUrl = photoUrl;
        employeeData.resumeUrl = resumeUrl;
        employeeData.kycDocumentUrl = kycDocumentUrl;

        // Save employee data to the database
        await saveEmployeeRegistrationData(employeeId, employeeData);

        // Generate JWT token
        const token = jwt.sign({ employeeId }, secretKey, { expiresIn: '30m' });

        // Send response with token
        return res.status(200).json({ message: "Data sent successfully.", token });
      } catch (error) {
        console.error("Error uploading files or saving data:", error);
        return res.status(500).json({ message: "Error uploading files or saving data" });
      }
    });
  },
};
