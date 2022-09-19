const createTokenUser = (user) => {
  return {
    username: user.username,

    image: user.image,
  };
};

module.exports = createTokenUser;
