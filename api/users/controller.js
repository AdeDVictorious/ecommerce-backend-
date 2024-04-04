const express = require('express');
let uservalidation = require('./validation');
const Services = require('./services');
const authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');

let usersRoute = express.Router();

let validation = new uservalidation();

/////------ User authentications ------///////

usersRoute.get('/myProfile', authUser, async (req, res) => {
  let service = new Services();
  let data = { ...req.userInfo };
  let resp = await service.get_profile(data);
  res.status(resp.status).json(resp);
});

//// ---- To work on this later for address Update ----////
usersRoute.put(
  '/updateMe',
  validation.validateUpdate(),
  authUser,
  async (req, res) => {
    let service = new Services();
    let data = { ...req.userInfo, ...req.body };
    let resp = await service.updateMe(data);
    res.status(resp.status).json(resp);
  }
);

////// ------- Admin Route -------- ////////
usersRoute.get(
  '/user/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let service = new Services();
    let data = { ...req.params };
    let resp = await service.getOneUser(data);
    res.status(resp.status).json(resp);
  }
);

usersRoute.get(
  '/getAllUsers',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllUsers(data);
    res.status(resp.status).json(resp);
  }
);

usersRoute.patch(
  '/user/:id',
  validation.validateUpdate(),
  authAdmin,
  async (req, res) => {
    let service = new Services();
    let data = { ...req.body, ...req.params };
    let resp = await service.updateUser(data);
    res.status(resp.status).json(resp);
  }
);

usersRoute.delete(
  '/user/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let service = new Services();
    let data = { ...req.params };
    let resp = await service.deleteUser(data);
    res.status(resp.status).json(resp);
  }
);

//// To work on this later for recover of paranoid users ////
usersRoute.post('/restore/user', authUser, async (req, res) => {
  let service = new Services();
  let data = { ...req.body, ...req.params };
  let resp = await service.restoreUser(data);
  res.status(resp.status).json(resp);
});

module.exports = usersRoute;
