const express = require('express');
let Services = require('./services');
let authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');

let contactUsRoute = express.Router();

///// ----- Anybody can send ----- //////
contactUsRoute.post('/addMessage', async (req, res) => {
  let data = { ...req.body };
  let service = new Services();
  let resp = await service.addMessage(data);
  res.status(resp.status).json(resp);
});

///// ----- UserRoute can send ----- //////
contactUsRoute.post('/contactUs', authUser, async (req, res) => {
  let data = { ...req.body, ...req.userInfo };
  let service = new Services();
  let resp = await service.addUserMessage(data);
  res.status(resp.status).json(resp);
});

///// ----- Admin Route to read and retrive messages ----- //////
contactUsRoute.get('/getMessage/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.getMessage(data);
  res.status(resp.status).json(resp);
});

contactUsRoute.get('/getAllMessages', authAdmin, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllMessages(data);
  res.status(resp.status).json(resp);
});

contactUsRoute.delete('/deleteMessage/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.deleteMessage(data);
  res.status(resp.status).json(resp);
});

module.exports = contactUsRoute;
