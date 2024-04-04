const express = require('express');
let Services = require('./services');
let contactUsValidation = require('./validation');
let authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');

let contactUsRoute = express.Router();

let validation = new contactUsValidation();

///// ----- Anybody can send ----- //////
contactUsRoute.post(
  '/addMessage',
  validation.validateMessage(),
  async (req, res) => {
    let data = { ...req.body };
    let service = new Services();
    let resp = await service.addMessage(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- UserRoute can send ----- //////
contactUsRoute.post(
  '/contactUs',
  validation.validateMessage(),
  authUser,
  async (req, res) => {
    let data = { ...req.body, ...req.userInfo };
    let service = new Services();
    let resp = await service.addUserMessage(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- Admin Route to read and retrive messages ----- //////
contactUsRoute.get(
  '/getMessage/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.getMessage(data);
    res.status(resp.status).json(resp);
  }
);

contactUsRoute.get(
  '/getAllMessages',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.getAllMessages(data);
    res.status(resp.status).json(resp);
  }
);

contactUsRoute.delete(
  '/deleteMessage/:id',
  validation.validateParams(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.deleteMessage(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = contactUsRoute;
