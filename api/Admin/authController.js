let express = require('express');
let Services = require('./services');

adminSignupRoute = express.Router();
adminLoginRoute = express.Router();
adminForgetPwdRoute = express.Router();
adminResetPwdRoute = express.Router();

adminSignupRoute.post('/signup', async (req, res) => {
  console.log(req.body);
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.addNewAdmin(data);
  res.status(resp.status).json(resp);
});

adminLoginRoute.post('/login', async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.loginAdmin(data);
  res.status(resp.status).json(resp);
});

adminForgetPwdRoute.post('/forgetPassword', async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.forgetPwd(data);
  res.status(resp.status).json(resp);
});

adminResetPwdRoute.post('/resetPassword/:token', async (req, res) => {
  // console.log(req.body, req.params);
  let service = new Services();
  let data = { ...req.body, ...req.params };
  let resp = await service.resetPwd(data);
  res.status(resp.status).json(resp);
});

module.exports = {
  adminSignupRoute,
  adminLoginRoute,
  adminForgetPwdRoute,
  adminResetPwdRoute,
};
