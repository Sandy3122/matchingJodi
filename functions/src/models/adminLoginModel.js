const admin = require("firebase-admin");
const adminCollection = admin.firestore().collection('admins');

async function getAdminByPhoneNumber(phoneNumber) {
    try {
        // Trim spaces from the provided phone number
        const formattedPhoneNumber = phoneNumber.trim();

        // Query the database using the formatted phone number
        const querySnapshot = await adminCollection.where('adminPhoneNumber', '==', formattedPhoneNumber).limit(1).get();
        if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data();
            return { id: adminDoc.id, ...adminData };
        }
        return null;
    } catch (error) {
        console.error('Error fetching admin by phone number:', error);
        throw new Error('An error occurred while fetching admin data. Please try again later.'); // Informative error message
    }
}

module.exports = {
    getAdminByPhoneNumber
};
