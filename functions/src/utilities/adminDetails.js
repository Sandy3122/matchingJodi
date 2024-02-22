const admin = require("firebase-admin");
const bcrypt = require('bcryptjs');

const adminsCollection = admin.firestore().collection('admins');

// Function to check if an admin with the provided email exists
async function checkExistingAdminByEmail(adminEmail) {
  const existingAdmin = await adminsCollection.where('adminEmail', '==', adminEmail).get();
  return !existingAdmin.empty;
}

// Function to initialize default admin data
async function initializeDefaultAdmin() {
  const defaultAdminData = {
    adminName: 'Admin User', // Default admin name
    adminPhoneNumber: '+1234567890', // Default admin phone number
    adminEmail: 'admin@example.com', // Default admin email
    pin: await bcrypt.hash('admin123', 10), // Default admin PIN (hashed)
  };

  try {
    const adminExists = await checkExistingAdminByEmail(defaultAdminData.adminEmail);
    if (!adminExists) {
      await adminsCollection.add(defaultAdminData);
      console.log('Default admin data added successfully.');
    } else {
      console.log('Default admin data already exists.');
    }
  } catch (error) {
    console.error('Error initializing default admin data:', error);
    throw error;
  }
}

// Call the function to initialize default admin data
initializeDefaultAdmin()
  .then(() => {
    console.log('Default admin data initialized successfully.');
  })
  .catch(error => {
    console.error('Error initializing default admin data:', error);
  });


  module.exports = {
    initializeDefaultAdmin
  }