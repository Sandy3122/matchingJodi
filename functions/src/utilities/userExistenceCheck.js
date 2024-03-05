const admin = require("firebase-admin");

// Function to check if a user exists with the provided email
async function checkExistingUserByEmail(email) {
  const existingEmailUser = await admin
    .firestore()
    .collection("employeeRegistrationData") // Corrected collection name
    .where("email", "==", email) // Assuming email field is named "email"
    .get();

  return !existingEmailUser.empty;
}

// Function to check if a user exists with the provided mobile number
async function checkExistingUserByMobileNumber(phoneNumber) {
  const existingMobileUser = await admin
    .firestore()
    .collection("employeeRegistrationData") // Corrected collection name
    .where("phoneNumber", "==", phoneNumber) // Assuming mobile number field is named "phoneNumber"
    .get();

  return !existingMobileUser.empty;
}

module.exports = {
  checkExistingUserByEmail,
  checkExistingUserByMobileNumber
}
