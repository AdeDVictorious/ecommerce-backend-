let jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization || req.headers.authorization == '') {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
    } else {
      let auth = req.headers.authorization.split(' ');
      if (auth.length != 2) {
        res.status(401).json({ status: 401, message: 'Access compromised' });
      } else {
        let bearer = auth[0];
        let token = auth[1];

        let decode = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
          return { status: 401, message: 'Unauthorised' };
        }

        req.userInfo = decode;

        // console.log(req.userInfo);

        next();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 401,
      message: 'Failed, an unknown error occurred, please try again later',
    });
  }
};

module.exports = authUser;
