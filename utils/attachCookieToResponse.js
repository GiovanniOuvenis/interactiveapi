const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const attachCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneD = 86400000;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneD),
    secure: true /*process.env.NODE_ENV === "production"*/,

    sameSite: "None",
  });
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  attachCookieToResponse,
  isTokenValid,
};
