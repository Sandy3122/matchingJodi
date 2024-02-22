const admin = require("firebase-admin");

async function checkExistingAdminByEmail(adminEmail) {
  const existingAdmin = await admin
    .firestore()
    .collection("admins")
    .where("adminEmail", "==", adminEmail)
    .get();

  return !existingAdmin.empty;
}

async function checkExistingAdminByPhoneNumber(adminPhoneNumber) {
  const existingAdmin = await admin
    .firestore()
    .collection("admins")
    .where("adminPhoneNumber", "==", adminPhoneNumber)
    .get();

  return !existingAdmin.empty;
}

module.exports = {
  checkExistingAdminByEmail,
  checkExistingAdminByPhoneNumber
};
