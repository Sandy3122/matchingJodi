const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  // Log the request headers for debugging
  // console.log(req.headers);

  // Retrieve the token from the session
  let token = req.session.token;

  // Log the retrieved token
  console.log("Token:", token);

  // Check if token is missing
  if (!token)
    return res.status(403).send({ auth: false, message: "Token not provided." });

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(401).send({ auth: false, message: "Failed to Authenticate Token" });

    // If verification succeeds, attach the user data to the request object
    req.user = user;

    // Log the user data for debugging
    console.log(req.user);

    // Call the next middleware in the chain
    next();
  });
};

module.exports = { authenticateToken };
