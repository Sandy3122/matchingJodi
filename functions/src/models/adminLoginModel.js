// admin login model
const admin = require("firebase-admin");

async function getAdminByPhoneNumber(phoneNumber) {
    try {
        const adminCollection = admin.firestore().collection('admins'); // Moved inside the function to ensure a fresh reference
        const querySnapshot = await adminCollection.where('phoneNumber', '==', phoneNumber).limit(1).get();
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
