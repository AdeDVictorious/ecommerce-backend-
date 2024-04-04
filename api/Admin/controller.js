const express = require('express');
let adminvalidation = require('./validation');
const authAdmin = require('../../middlewares/authAdmin');
const Services = require('./services');

AdminRoute = express.Router();

let validation = new adminvalidation();

/////------ User authentications ------///////

AdminRoute.get('/admin/getMe', authAdmin, async (req, res) => {
  let service = new Services();
  let data = { ...req.userInfo };
  let resp = await service.getMe(data);
  res.status(resp.status).json(resp);
});

//// ---- To work on this later for address Update ----////
AdminRoute.put(
  '/admin/updateMe',
  validation.validateUpdate(),
  authAdmin,
  async (req, res) => {
    let service = new Services();
    let data = { ...req.userInfo, ...req.body };
    let resp = await service.updateMe(data);
    res.status(resp.status).json(resp);
  }
);

////// ------- Admin Route -------- ////////

AdminRoute.get(
  '/getAdmin/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = {
      ...req.userinfo,
      ...req.params,
    };
    let service = new Services();
    let resp = await service.getOneAdmin(data);
    res.status(resp.status).json(resp);
  }
);

AdminRoute.get(
  '/getAllAdmin',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllAdmins(data);
    res.status(resp.status).json(resp);
  }
);

AdminRoute.patch(
  '/updateAdmin/:id',
  validation.validateUpdate(),
  authAdmin,
  async (req, res) => {
    console.log(req.file);
    let data = { ...req.userinfo, ...req.body };
    let service = new Services();
    let resp = await service.updateAdmin(data);
    res.status(resp.status).json(resp);
  }
);

AdminRoute.delete(
  '/deleteAdmin/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.deleteAdmin(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = AdminRoute;
