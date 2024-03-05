// authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    let token;
    if (req.session.employeeToken) {
        token = req.session.employeeToken;
        // console.log("Employee",token);
    } else if (req.session.adminToken) {
        token = req.session.adminToken;
        // console.log("Admin",token);
    } else {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error verifying JWT token:', err);
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded; // Set decoded user information on req.user
        next(); // Move to the next middleware or route handler
    });
}

module.exports = {
    authenticateToken
};
