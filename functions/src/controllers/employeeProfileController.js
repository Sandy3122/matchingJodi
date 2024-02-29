const admin = require("firebase-admin");

// Fetch employee profile data
async function getEmployeeProfile(req, res) {
    try {
        // Ensure user object exists in request
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID not provided in request.' });
        }

        const employeeId = req.user.id; // Extract employee ID from authenticated user
        const employeeRef = admin.firestore().collection('employeeRegistrationData').doc(employeeId);
        const employeeDoc = await employeeRef.get();

        if (!employeeDoc.exists) {
            return res.status(404).json({ message: 'Employee profile not found.' });
        }
        
        const employeeData = employeeDoc.data();
        return res.status(200).json({ employee: employeeData });
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getEmployeeProfile
};
