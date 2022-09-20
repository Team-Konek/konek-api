const auth = (req, res, next) => {
  console.log('Here');
  next();
};

module.exports = auth;