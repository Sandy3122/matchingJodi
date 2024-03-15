// ProfileController.js

const admin = require("firebase-admin");

// Fetch profile data based on user role
async function getUserProfile(req, res) {
    try {
        // Ensure user object exists in request
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID not provided in request.' });
        }

        const userId = req.user.id; // Extract user ID from authenticated user
        let userRole;

        // Check if user role exists in the session
        if (req.session.role) {
            userRole = req.session.role;
        } else {
            return res.status(400).json({ error: 'User role not found in session.' });
        }

        if (userRole === 'admin') {
            return getAdminProfile(req, res, userId);
        } else if (userRole === 'employee') {
            return getEmployeeProfile(req, res, userId);
        } else {
            return res.status(400).json({ error: 'Invalid user role.' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




// Fetch employee profile data
async function getEmployeeProfile(req, res, employeeId) {
    try {
        const employeeRef = admin.firestore().collection('employeeRegistrationData').doc(employeeId);
        const employeeDoc = await employeeRef.get();

        if (!employeeDoc.exists) {
            return res.status(404).json({ message: 'Employee profile not found.' });
        }
        
        const employeeData = employeeDoc.data();
        return res.status(200).json({ user: employeeData });
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Fetch admin profile data
async function getAdminProfile(req, res, adminId) {
    try {
        const adminRef = admin.firestore().collection('admins').doc(adminId);
        const adminDoc = await adminRef.get();

        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin profile not found.' });
        }
        
        const adminData = adminDoc.data();
        return res.status(200).json({ user: adminData });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// Employee Logout route
async function userLogout(req, res) {
    // Check if role exists in the session
    if (req.session.role) {
        const role = req.session.role;
        // Clear the token and role from the session
        delete req.session.token;
        delete req.session.role;

        // Redirect based on role
        if (role === "admin") {
            res.redirect('/admin/admin-login');
        } else if (role) {
            res.redirect('/employee/employee-login');
        } else {
            // Handle other roles if needed
            res.redirect('/');
        }
    } else {
        // If role is not found, stay on the same page
        res.redirect('back'); // Redirect back to the previous page
    }
}


module.exports = {
    getUserProfile,
    userLogout
};
