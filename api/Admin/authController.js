let express = require('express');
let adminvalidation = require('./validation');
let Services = require('./services');

adminSignupRoute = express.Router();
adminLoginRoute = express.Router();
adminForgetPwdRoute = express.Router();
adminResetPwdRoute = express.Router();

let validation = new adminvalidation();

adminSignupRoute.post(
  '/signup',
  validation.validateSignup(),
  async (req, res) => {
    console.log(req.body);
    let service = new Services();
    let data = { ...req.body };
    let resp = await service.addNewAdmin(data);
    res.status(resp.status).json(resp);
  }
);

adminLoginRoute.post('/login', validation.validateLogin(), async (req, res) => {
  let service = new Services();
  let data = { ...req.body };
  let resp = await service.loginAdmin(data);
  res.status(resp.status).json(resp);
});

adminForgetPwdRoute.post(
  '/forgetPassword',
  validation.validateforgetPwd(),
  async (req, res) => {
    let service = new Services();
    let data = { ...req.body };
    let resp = await service.forgetPwd(data);
    res.status(resp.status).json(resp);
  }
);

adminResetPwdRoute.post(
  '/resetPassword/:token',
  validation.validateresetToken(),
  validation.validateresetPwd(),
  async (req, res) => {
    // console.log(req.body, req.params);
    let service = new Services();
    let data = { ...req.body, ...req.params };
    let resp = await service.resetPwd(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = {
  adminSignupRoute,
  adminLoginRoute,
  adminForgetPwdRoute,
  adminResetPwdRoute,
};
