const express = require('express');
let paymentValidation = require('./validation');
let Services = require('./service');
let authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');

let paymentRoute = express.Router();

let validation = new paymentValidation();

//// ----- Authorize Users route ----- /////
paymentRoute.get(
  '/getOnePayment/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.getOnePayment(data);
    res.status(resp.status).json(resp);
  }
);

//// ----- Authorize Admin route ----- /////
paymentRoute.post(
  '/addPayment',
  validation.validatePayment(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.body };
    let service = new Services();
    let resp = await service.addPayment(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.get(
  '/retrieveStatus/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.getPaymentStatus(data);
    res.status(resp.status).json(resp);
  }
);

//// ----- This route is new ----- /////
paymentRoute.get(
  '/getUserPayment/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.getUsersPayment(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.get(
  '/getAllPayments',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllPayment(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.patch(
  '/updatePayment/:id',
  validation.validateParams(),
  validation.validateUpdate(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params, ...req.body };
    let service = new Services();
    let resp = await service.updatePayment(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.get(
  '/getSuccessStatus',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getSuccessStatus(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.get(
  '/getFailedStaus',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getFailedStatus(data);
    res.status(resp.status).json(resp);
  }
);

paymentRoute.get('/getAllRevenue', authAdmin, async (req, res) => {
  let service = new Services();
  let resp = await service.getAllRevenue();
  res.status(resp.status).json(resp);
});

paymentRoute.delete(
  '/deletePayment/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.deletePayment(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = paymentRoute;
