// employeeRegistrationModel.js
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "matchingjodiweb.appspot.com",
  });
}

const db = admin.firestore();

module.exports = {
  saveUserRegistrationData: async function (userId, userData) {
    try {
      await db.collection('appusers').doc(userId).set(userData);
      return true;
    } catch (error) {
      console.error('Error saving user registration data:', error);
      throw error;
    }
  },

  updateUserRouteAccess: async function (userId, routes) {
    try {
      await db.collection('appusers').doc(userId).update({ routes: routes });
      return true;
    } catch (error) {
      console.error('Error updating user route access:', error);
      throw error;
    }
  }
};
