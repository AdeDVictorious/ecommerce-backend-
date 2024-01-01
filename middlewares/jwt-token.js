let jwt = require('jsonwebtoken');

function jwtToken({ user_id, user_firstName, user_email }) {
  const user = { user_id, user_firstName, user_email };
  console.log(user);
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { loginToken };
}

module.exports = { jwtToken };
