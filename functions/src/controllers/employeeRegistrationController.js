const multer = require("multer");
const { saveEmployeeRegistrationData } = require("../models/employeeRegistrationModel");
const { generateNumericId } = require("../utilities/generateIds");
const admin = require("firebase-admin");
const sharp = require("sharp");
const bcrypt = require('bcryptjs');

const bucket = admin.storage().bucket();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

async function compressImage(file) {
  return sharp(file.buffer)
    .resize(800) // Adjust the size as needed
    .toBuffer();
}

module.exports = {
  handleEmployeeRegistration: async function (req, res) {
    upload.fields([
      { name: "employeePhoto", maxCount: 1 },
      { name: "employeeResume", maxCount: 1 },
      { name: "kycDocument", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        // Check if the error is due to file size limit exceeded
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("File size limit exceeded (max 2MB)");
        }
        console.error("Error uploading files:", err);
        return res.status(500).send("Error uploading files");
      }

      const files = req.files;

      if (
        !files ||
        !files.employeePhoto ||
        !files.employeeResume ||
        !files.kycDocument
      ) {
        return res.status(400).send("Files not uploaded");
      }

      const isAdminPanel = req.headers["source"] === "adminPanel";

      const employeeId = "e" + generateNumericId();

      // Ensure the employee's folder exists
     

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

      const firstNameLowerCase = firstName.toLowerCase();
      const sanitizedFirstName = firstNameLowerCase.replace(/[^\w\s]/gi, ''); // Remove special characters
      const employeeFolder = `employees/${employeeId}_${sanitizedFirstName}`;

      await bucket.file(employeeFolder).save('', { resumable: false });

      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      // Hashing the pin/password
      const hashedPin = await bcrypt.hash(pin, 10);

      const employeeData = {
        firstName,
        lastName,
        gender: gender === "option2" ? "Male" : gender === "option1" ? "Female" : "Other",
        maritalStatus: maritalStatus === "yes" ? "Yes" : "No",
        employeeDOB,
        timestamp,
        employeeId,
        employeeEmail,
        employeePhoneNumber,
        employeeEmergencyPhoneNumber,
        pin: hashedPin,
        kycDocumentType,
        role: isAdminPanel ? (role || "user") : "user",
        designation: isAdminPanel ? (designation || "Employee") : "employee",
        joiningDate: joiningDate ? new Date(joiningDate) : timestamp, // Assuming joiningDate is a date string
        accountStatus: isAdminPanel ? (accountStatus || "Active") : "inactive"
      };

      try {
        const photoUrl = await uploadFile(files.employeePhoto[0], employeeFolder, employeeId, "employeeProfilePic");
        const resumeUrl = await uploadFile(files.employeeResume[0], employeeFolder, employeeId, "employeeResume");
        const kycDocumentUrl = await uploadFile(files.kycDocument[0], employeeFolder, employeeId, "kycDocument", kycDocumentType);

        employeeData.photoUrl = photoUrl;
        employeeData.resumeUrl = resumeUrl;
        employeeData.kycDocumentUrl = kycDocumentUrl;

        await saveEmployeeRegistrationData(employeeId, employeeData);

        return res.status(200).json({ message: "Data sent successfully." });
      } catch (error) {
        console.error("Error uploading files or saving data:", error);
        res.status(500).json({ error: "Error uploading files or saving data" });
      }
    });
  },
};

async function uploadFile(file, folder, employeeId, fileType, kycDocumentType) {
  // Compress image files before uploading
  if (file.mimetype.startsWith("image/")) {
    file.buffer = await compressImage(file);
  }

  let fileName;
  if (fileType === "employeeProfilePic") {
    fileName = `${employeeId}_profile_pic.${file.originalname.split('.').pop()}`;
  } else if (fileType === "employeeResume") {
    fileName = `${employeeId}_resume.${file.originalname.split('.').pop()}`;
  } else if (fileType === "kycDocument") {
    fileName = `${employeeId}_${kycDocumentType}.${file.originalname.split('.').pop()}`;
  } else {
    fileName = file.originalname;
  }

  const filePath = `${folder}/${fileName}`;

  return new Promise((resolve, reject) => {
    const fileUpload = bucket.file(filePath);
    const fileStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype }, // Ensure contentType is set correctly
    });

    fileStream.on("error", (error) => reject(error));
    fileStream.on("finish", () => {
      fileUpload
        .makePublic()
        .then(() => resolve(fileUpload.publicUrl()))
        .catch((error) => reject(error));
    });

    fileStream.end(file.buffer);
  });
}