const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'chem_unlock_secret_key';
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

module.exports = generateToken;
