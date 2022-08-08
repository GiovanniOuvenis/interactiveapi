const CustomApiError = require("./CustomApiError");
const UnauthenticatedError = require("./UnauthenticatedError");
const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./Unauthorized");

module.exports = {
  UnauthorizedError,
  UnauthenticatedError,
  BadRequestError,
  CustomApiError,
};
