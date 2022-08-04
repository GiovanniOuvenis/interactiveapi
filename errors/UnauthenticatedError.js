const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./CustomApiError");

class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthenticatedError;
