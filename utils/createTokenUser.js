const createTokenUser = (user) => {
  return { username: user.username, password: user.password };
};

module.exports = createTokenUser;
