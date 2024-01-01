const express = require('express');
let authAdmin = require('../../middlewares/authAdmin');
let authUser = require('../../middlewares/authUser');
const Services = require('./services');

let locationRoute = express.Router();

///// ----- to access the All locations ----- /////
locationRoute.get('/getAllLocation', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllLocation(data);
  res.status(resp.status).json(resp);
});

///// ----- Admin Route ----- /////
locationRoute.post('/addLocation', authAdmin, async (req, res) => {
  let data = { ...req.body };
  let service = new Services();
  let resp = await service.addLocation(data);
  res.status(resp.status).json(resp);
});

///// ----- Users Route ----- /////
locationRoute.get('/getLocation/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.getLocation(data);
  res.status(resp.status).json(resp);
});

locationRoute.get('/getAllLocation', authAdmin, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllLocation(data);
  res.status(resp.status).json(resp);
});

locationRoute.patch('/updateLocation/:id', authAdmin, async (req, res) => {
  let data = { ...req.params, ...req.body };
  let service = new Services();
  let resp = await service.updateLocation(data);
  res.status(resp.status).json(resp);
});

locationRoute.delete('/deleteLocation/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.deleteLocation(data);
  res.status(resp.status).json(resp);
});

///// ----- User route for selecting State ----- /////
locationRoute.get('/pick-state', async (req, res) => {
  let service = new Services();
  let resp = await service.pickState();
  res.status(resp.status).json(resp);
});

///// ----- User route for selecting LGA ----- /////
locationRoute.get('/get_stateLGA/:id', async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.pickLGA(data);
  res.status(resp.status).json(resp);
});

module.exports = locationRoute;
