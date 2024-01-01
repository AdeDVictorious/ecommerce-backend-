let express = require('express');
let Services = require('./services');


signupRoute = express.Router();
loginRoute = express.Router();
forgetPwdRoute = express.Router();
resetPwdRoute = express.Router();

signupRoute.post('/signup', async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.addNewUser(data);
  res.status(resp.status).json(resp);
});

loginRoute.post('/login', async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.loginUser(data);
  res.status(resp.status).json(resp);
});

forgetPwdRoute.post('/forgetPassword', async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.forgetPwd(data);
  res.status(resp.status).json(resp);
});

resetPwdRoute.post('/resetPassword', async (req, res) => {
  let data = { ...req.body };
  let service = new Services();
  let resp = await service.resetPwd(data);
  res.status(resp.status).json(resp);
});

module.exports = {
  signupRoute,
  loginRoute,
  forgetPwdRoute,
  resetPwdRoute,
};
