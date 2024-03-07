const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
    getAllAccessRights: async function(req, res) {
        try {
            const snapshot = await db.collection('accessRights').get();
            const accessRights = [];
            snapshot.forEach(doc => {
                accessRights.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            res.status(200).json(accessRights);
        } catch (error) {
            console.error("Error fetching access rights:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    },

    updateAccessRightStatus: async function(req, res) {
        const accessRightId = req.params.accessRightId;
        const { status } = req.body;

        try {
            const accessRightRef = db.collection('accessRights').doc(accessRightId);
            await accessRightRef.update({ status });
            res.status(200).json({ message: `Access right status updated successfully` });
        } catch (error) {
            console.error('Error updating access right status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateAccessRightRoutes: async function(req, res) {
        const accessRightId = req.params.accessRightId;
        const { routeName } = req.body;

        try {
            const accessRightRef = db.collection('accessRights').doc(accessRightId);
            await accessRightRef.update({ routeName });
            res.status(200).json({ message: `Access right routes updated successfully` });
        } catch (error) {
            console.error('Error updating access right routes:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    addRoleRights: async function(req, res) {
        const { role, status } = req.body;
        const routeName = []; // Empty array for routeName
    
        try {
            // Add the role rights data to the Firestore collection
            const docRef = await db.collection('accessRights').add({
                role,
                routeName,
                status
            });
    
            res.status(201).json({ message: 'Role rights added successfully', id: docRef.id });
        } catch (error) {
            console.error('Error adding role rights:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteAccessRight: async function(req, res) {
        const accessRightId = req.params.accessRightId;
    
        try {
            // Delete the access right from the Firestore collection
            await db.collection('accessRights').doc(accessRightId).delete();
    
            res.status(200).json({ message: 'Access right deleted successfully' });
        } catch (error) {
            console.error('Error deleting access right:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    
};
