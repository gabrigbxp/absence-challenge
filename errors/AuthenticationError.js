class AuthenticationError extends Error {
  constructor(message) {
    super();
    this.code = 401;
    this.message = message;
  }
}

module.exports = AuthenticationError
