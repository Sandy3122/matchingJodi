// adminLoginModel.js
const admin = require("firebase-admin");
const bcrypt = require('bcryptjs');

const adminsCollection = admin.firestore().collection('admins'); // Assuming you have a collection named 'admins' in Firestore

async function getAdminByPhoneNumber(phoneNumber) {
    try {
        const querySnapshot = await employeesCollection.where('adminPhoneNumber', '==', phoneNumber).limit(1).get();
        if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data();
            return { id: adminDoc.id, ...adminData };
        }
        return null; // No admin found with the provided phone number
    } catch (error) {
        console.error('Error fetching admin by phone number:', error);
        throw new Error('An error occurred while fetching admin data. Please try again later.'); // Informative error message
    }
}


async function authenticateAdmin(username, password) {
    try {
        const admin = await getAdminByUsername(username);
        if (!admin) {
            return false; // Admin not found
        }
        // Compare the provided password with the hashed admin password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        return isPasswordValid;
    } catch (error) {
        console.error('Error authenticating admin:', error);
        throw error;
    }
}

module.exports = {
    authenticateAdmin
};
