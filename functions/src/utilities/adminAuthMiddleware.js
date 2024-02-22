// adminAuthMiddleware.js

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const adminAuthMiddleware = (req, res, next) => {
    // Retrieve the token from the session
    let token = req.session.token;

    // Check if token is missing
    if (!token) {
        return res.status(403).json({ auth: false, message: "Token not provided." });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err || user.userType !== 'admin') {
            return res.status(401).json({ auth: false, message: "Unauthorized access." });
        }

        // If verification succeeds and user type is admin, attach the user data to the request object
        req.user = user;

        // Call the next middleware in the chain
        next();
    });
};

module.exports = adminAuthMiddleware;
