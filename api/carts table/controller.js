const express = require('express');
const authAdmin = require('../../middlewares/authAdmin');
const authUser = require('../../middlewares/authUser');
let Services = require('./services');

cartRoute = express.Router();

///// ----- Users Route ----- /////
cartRoute.post('/add-quantity-to-cart', authUser, async (req, res) => {
  let data = { ...req.userInfo, ...req.body };
  let service = new Services();
  let resp = await service.addCart(data);
  res.status(resp.status).json(resp);
});

cartRoute.post('/addToCart', authUser, async (req, res) => {
  let data = { ...req.userInfo, ...req.body };
  let service = new Services();
  let resp = await service.addToCart(data);
  res.status(resp.status).json(resp);
});

cartRoute.post('/substract_cartQty', authUser, async (req, res) => {
  let data = { ...req.userInfo, ...req.body };
  let service = new Services();
  let resp = await service.substract_cartQty(data);
  res.status(resp.status).json(resp);
});

cartRoute.get('/getAllCart', authUser, async (req, res) => {
  let data = { ...req.userInfo, ...req.query };
  let service = new Services();
  let resp = await service.getAllCart(data);
  res.status(resp.status).json(resp);
});

cartRoute.get('/get_delivery_fee/:id', authUser, async (req, res) => {
  let data = { ...req.userInfo };
  let data1 = { ...req.params };
  let service = new Services();
  let resp = await service.get_delivery_fee(data, data1);
  res.status(resp.status).json(resp);
});

cartRoute.delete('/deleteCart/:id', authUser, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.deleteCart(data);
  res.status(resp.status).json(resp);
});

///////// ----- Admins Route ------ /////////////
cartRoute.get('/getCart/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let data1 = { ...req.userInfo };
  let service = new Services();
  let resp = await service.getCartItem(data, data1);
  res.status(resp.status).json(resp);
});

cartRoute.patch('/updateCart/:id', authAdmin, async (req, res) => {
  let data = { ...req.params, ...req.body };
  let service = new Services();
  let resp = await service.updateCart(data);
  res.status(resp.status).json(resp);
});

cartRoute.get('/getAllCartItems', authAdmin, async (req, res) => {
  // let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllCartsItem();
  res.status(resp.status).json(resp);
});

module.exports = cartRoute;
