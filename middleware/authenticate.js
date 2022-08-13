const CustomError = require("../errors/index");
const { isTokenValid } = require("../utils/attachCookieToResponse");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  try {
    const { username } = isTokenValid({ token });
    req.username = username;
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  next();
};

module.exports = { authenticateUser };
