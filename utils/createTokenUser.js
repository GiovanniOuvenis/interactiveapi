const createTokenUser = (user) => {
  return {
    username: user.username,
    password: user.password,
    image: user.image,
  };
};

module.exports = createTokenUser;
