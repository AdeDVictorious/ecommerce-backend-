const express = require('express');
let Services = require('./services');
let wishlistvalidation = require('./validation');
let authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');

let wishlistRoute = express.Router();

let validation = new wishlistvalidation();

wishlistRoute.post(
  '/addToWishlist',
  validation.validateAddWishList(),
  authUser,
  async (req, res) => {
    let data = { ...req.body, ...req.userInfo };
    let service = new Services();
    let resp = await service.addWishlist(data);
    res.status(resp.status).json(resp);
  }
);

wishlistRoute.get(
  '/getWishlist/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    let data = { ...req.params };
    let data1 = { ...req.userInfo };
    let service = new Services();
    let resp = await service.getWishlist(data, data1);
    res.status(resp.status).json(resp);
  }
);

wishlistRoute.get('/getAllWishlist', authUser, async (req, res) => {
  let data = { ...req.userInfo };
  let service = new Services();
  let resp = await service.getAllWishlist(data);
  res.status(resp.status).json(resp);
});

wishlistRoute.delete(
  '/deleteWishlist/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    let data = { ...req.params };
    let service = new Services();
    let resp = await service.deleteWishlist(data);
    res.status(resp.status).json(resp);
  }
);

///// ----- Admin Route ----- /////
wishlistRoute.get(
  '/get_All_Wishlist',
  validation.validateQuery(),
  authAdmin,
  async (req, res) => {
    let data = { ...req.query };
    let service = new Services();
    let resp = await service.get_All_Wishlist(data);
    res.status(resp.status).json(resp);
  }
);

module.exports = wishlistRoute;
