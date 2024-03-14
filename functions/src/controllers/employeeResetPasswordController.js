const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
    resetEmployeePassword: async function(req, res) {
        const { employeeId, newPassword } = req.body;

        try {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update employee password in the Firestore collection
            await db.collection('employeeRegistrationData').doc(employeeId).update({ pin: hashedPassword });

            res.status(200).json({ message: "Password reset successfully." });
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    }
};
