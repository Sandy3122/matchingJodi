// employeeSearchController.js
const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
  searchEmployees: async function(req, res) {
    try {
      // Retrieve all employee records
      const snapshot = await db.collection('employeeRegistrationData').get();

      if (snapshot.empty) {
        return res.status(404).json({ error: "No employees found." });
      }

      const employees = [];
      snapshot.forEach(doc => {
        employees.push(doc.data());
      });

      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error searching employees:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
