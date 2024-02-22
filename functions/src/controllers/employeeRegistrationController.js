// employeeRegistrationController.js
const multer = require("multer");
const { saveEmployeeRegistrationData } = require("../models/employeeRegistrationModel");
const { generateNumericId } = require("../utilities/generateIds");
const admin = require("firebase-admin");
const sharp = require("sharp");
const bcrypt = require('bcryptjs');
const { PDFDocument } = require('pdf-lib');
const jwt = require('jsonwebtoken');
const { checkExistingUserByEmail, checkExistingUserByMobileNumber } = require("../utilities/userExistenceCheck");


const secretKey = process.env.SECRET_KEY

const bucket = admin.storage().bucket();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

async function compressImage(file) {
  return sharp(file.buffer)
    .resize({ width: 600 }) // Resize to a maximum width of 600 pixels
    .jpeg({ quality: 70 }) // Compress and convert to JPEG format with 70% quality
    .toBuffer();
}

async function compressPDF(file) {
  const pdfDoc = await PDFDocument.load(file.buffer);
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function compressFile(file, fileType) {
  if (fileType === "application/pdf") {
    return compressPDF(file);
  } else if (fileType.startsWith("image/")) {
    return compressImage(file);
  } else {
    return file.buffer;
  }
}

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

module.exports = {
  handleEmployeeRegistration: async function (req, res) {
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

      const isAdminPanel = req.headers["source"] === "adminPanel";

      const employeeId = "e" + generateNumericId();

      const {
        firstName,
        lastName,
        gender,
        employeeDOB,
        maritalStatus,
        employeeEmail,
        employeePhoneNumber,
        employeeEmergencyPhoneNumber,
        pin,
        kycDocumentType,
        role,
        designation,
        joiningDate,
        accountStatus
      } = req.body;

      // Ensure the employee's folder exists
      const employeeFolder = `employees/${employeeId}`;

      try {

        // Check if the user already exists with the provided email
        const emailExists = await checkExistingUserByEmail(employeeEmail);
        if (emailExists) {
          return res.status(401).json({ message: "User already exists with this email." });
        }
        
        // Check if the user already exists with the provided mobile number
        const mobileNumberExists = await checkExistingUserByMobileNumber(employeePhoneNumber);
        if (mobileNumberExists) {
          return res.status(401).json({ message: "User already exists with this mobile number." });
        }
        

        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // Hashing the pin/password
        const hashedPin = await bcrypt.hash(pin, 10);

        // Convert relevant fields to lowercase
        const lowerCaseFirstName = firstName.toLowerCase().trim();
        const lowerCaseLastName = lastName.toLowerCase().trim();
        const lowerCaseGender = gender.toLowerCase().trim();
        const lowerCaseEmployeeEmail = employeeEmail.toLowerCase().trim();
        const lowerCaseKycDocumentType = kycDocumentType.toLowerCase().trim();
        const lowerCaseMaritalStatus = maritalStatus.toLowerCase().trim();

        const employeeData = {
          firstName: lowerCaseFirstName,
          lastName: lowerCaseLastName,
          gender: lowerCaseGender,
          maritalStatus: lowerCaseMaritalStatus,
          employeeDOB,
          timestamp,
          employeeId,
          employeeEmail: lowerCaseEmployeeEmail,
          employeePhoneNumber,
          employeeEmergencyPhoneNumber,
          pin: hashedPin,
          kycDocumentType: lowerCaseKycDocumentType,
          role: isAdminPanel ? (role || "user") : "user",
          designation: isAdminPanel ? (designation || "Employee") : "employee",
          joiningDate: joiningDate ? new Date(joiningDate) : timestamp,
          accountStatus: isAdminPanel ? (accountStatus || "active") : "inactive"
        };

        const photoUrl = await uploadFile(files.employeePhoto[0], employeeFolder, employeeId, "employeeProfilePic");
        const resumeUrl = await uploadFile(files.employeeResume[0], employeeFolder, employeeId, "employeeResume");
        const kycDocumentUrl = await uploadFile(files.kycDocument[0], employeeFolder, employeeId, "kycDocument", kycDocumentType);

        employeeData.photoUrl = photoUrl;
        employeeData.resumeUrl = resumeUrl;
        employeeData.kycDocumentUrl = kycDocumentUrl;

        await saveEmployeeRegistrationData(employeeId, employeeData);

        // Generate JWT token
        const token = jwt.sign({ employeeId }, secretKey, { expiresIn: '30m' }); // Replace 'your_secret_key' with your actual secret key

        return res.status(200).json({ message: "Data sent successfully.", token });
      } catch (error) {
        console.error("Error uploading files or saving data:", error);
        return res.status(500).json({ error: "Error uploading files or saving data" });
      }
    });
  },
};
