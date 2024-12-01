const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthenticatedError("Authentication token missing or malformed.")
    );
  }

  const token = authHeader.split(" ")[1];
  console.log("Token is ->  ", token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthenticatedError(
          "Authentication token has expired. Please log in again."
        )
      );
    }
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthenticatedError("Invalid authentication token."));
    }

    return next(new UnauthenticatedError("Authentication failed."));
  }
};

module.exports = auth;
