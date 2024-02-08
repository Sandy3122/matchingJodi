// employeeRegistrationController.js
const multer = require("multer");
const {
  saveEmployeeRegistrationData,
} = require("../models/employeeRegistrationModel");
const { generateNumericId } = require("../utilities/generateIds");
const admin = require("firebase-admin");
const sharp = require("sharp");

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

async function uploadFile(file, folder) {
  // Compress image files before uploading
  if (file.mimetype.startsWith("image/")) {
    file.buffer = await compressImage(file);
  }

  return new Promise((resolve, reject) => {
    const fileUpload = bucket.file(`${folder}/${file.originalname}`);
    const fileStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
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

      const employeeId = "e" + generateNumericId();

      const {
        firstName,
        lastName,
        gender,
        maritalStatus,
        employeeEmail,
        employeePhoneNumber,
        employeeEmergencyPhoneNumber,
        pin,
        kycDocumentType,
      } = req.body;

      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      const employeeData = {
        firstName,
        lastName,
        gender,
        maritalStatus,
        timestamp,
        employeeId,
        employeeEmail,
        employeePhoneNumber,
        employeeEmergencyPhoneNumber,
        pin,
        kycDocumentType,
      };

      const employeePhoto = files.employeePhoto[0];
      const employeeResume = files.employeeResume[0];
      const kycDocument = files.kycDocument[0];

      try {
        const photoUrl = await uploadFile(employeePhoto, "employeePhotos");
        const resumeUrl = await uploadFile(employeeResume, "employeeResumes");
        const kycDocumentUrl = await uploadFile(kycDocument, "kycDocuments");

        employeeData.photoUrl = photoUrl;
        employeeData.resumeUrl = resumeUrl;
        employeeData.kycDocumentUrl = kycDocumentUrl;

        await saveEmployeeRegistrationData(employeeId, employeeData);

        res.status(200).json(employeeData);
      } catch (error) {
        console.error("Error uploading files or saving data:", error);
        res.status(500).json({ error: "Error uploading files or saving data" });
      }
    });
  },
};
