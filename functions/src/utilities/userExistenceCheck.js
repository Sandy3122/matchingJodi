const admin = require("firebase-admin");

// Function to check if a user exists with the provided email
async function checkExistingUserByEmail(employeeEmail) {
  const existingEmailUser = await admin
    .firestore()
    .collection("employeeRegistrationData") // Corrected collection name
    .where("employeeEmail", "==", employeeEmail) // Assuming email field is named "employeeEmail"
    .get();

  return !existingEmailUser.empty;
}

// Function to check if a user exists with the provided mobile number
async function checkExistingUserByMobileNumber(employeePhoneNumber) {
  const existingMobileUser = await admin
    .firestore()
    .collection("employeeRegistrationData") // Corrected collection name
    .where("employeePhoneNumber", "==", employeePhoneNumber) // Assuming mobile number field is named "employeePhoneNumber"
    .get();

  return !existingMobileUser.empty;
}

module.exports = {
  checkExistingUserByEmail,
  checkExistingUserByMobileNumber
}
