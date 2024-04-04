const express = require('express');
let locationValidation = require('./validation');
let authAdmin = require('../../middlewares/authAdmin');
let authUser = require('../../middlewares/authUser');
const Services = require('./services');
const { valid } = require('joi');

let locationRoute = express.Router();

let validation = new locationValidation();

///// ----- to access the All locations ----- /////
locationRoute.get(
  '/getAllLocation',
  validation.validateQuery(),
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllLocation(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- Admin Route ----- /////
locationRoute.post(
  '/addLocation',
  validation.validateLocation(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.body };
    let service = new Services();
    let resp = await service.addLocation(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- Users Route ----- /////
locationRoute.get(
  '/getLocation/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.getLocation(data);
    res.status(resp.status).json(resp);
  }
);

locationRoute.get(
  '/getAllLocation',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllLocation(data);
    res.status(resp.status).json(resp);
  }
);

locationRoute.patch(
  '/updateLocation/:id',
  validation.validateParams(),
  validation.validateUpdate(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params, ...req.body };
    let service = new Services();
    let resp = await service.updateLocation(data);
    res.status(resp.status).json(resp);
  }
);

locationRoute.delete(
  '/deleteLocation/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.deleteLocation(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- User route for selecting State ----- /////
locationRoute.get('/pick-state', async (req, res) => {
  let service = new Services();
  let resp = await service.pickState();
  res.status(resp.status).json(resp);
});

///// ----- User route for selecting LGA ----- /////
locationRoute.get(
  '/get_stateLGA/:id',
  validation.validateStateID(),
  async (req, res) => {
    let data = { ...req.params };
    console.log(data);
    let service = new Services();
    let resp = await service.pickLGA(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = locationRoute;
