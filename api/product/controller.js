const express = require('express');
const authUser = require('../../middlewares/authUser');
let authAdmin = require('../../middlewares/authAdmin');
let uploadImage = require('../../middlewares/uploadImage');
let Services = require('./services');

let productRoute = express.Router();
let uploadRoute = express.Router();

///// ----- Dashboard Route Anyone can view ----- /////
productRoute.get('/dashboard', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.dashboard(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/bestSelling', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.bestSelling(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/varities', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.varities(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/getPreview/:id', async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.previewProduct(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/search_query', async (req, res) => {
  console.log(req.query, 'Am inside the query @ backend');
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.query_search(data);
  res.status(resp.status).json(resp);
});

///// ----- Users Route ----- /////
productRoute.get('/getAllProduct', authUser, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllProduct(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/getBestSelling', authUser, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getBestSelling(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/getVarities', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getVarities(data);
  res.status(resp.status).json(resp);
});

///// ----- Users shop ----- /////
productRoute.get('/shopping', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getShop(data);
  res.status(resp.status).json(resp);
});

///// ----- Users shopping pagination ----- /////
productRoute.get('/shopping_page', async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.ShopByPage(data);
  res.status(resp.status).json(resp);
});

///// ----- Users shopping reviews ----- /////
productRoute.post('/post_review', authUser, async (req, res) => {
  let data = { ...req.body, ...req.userInfo };
  let service = new Services();
  let resp = await service.post_review(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/getProduct/:id', authUser, async (req, res) => {
  let data = {
    ...req.userinfo,
    ...req.params,
  };
  let service = new Services();
  let resp = await service.getProductPreview(data);
  res.status(resp.status).json(resp);
});

///// ----- Admin Route ----- /////
productRoute.post(
  '/addProduct',
  authAdmin,
  uploadImage.single('image'),
  async (req, res) => {
    let data = {
      ...req.userInfo,
      ...req.body,
      ...req.file,
    };

    let service = new Services();
    let resp = await service.addProduct(data);
    res.status(resp.status).json(resp);
  }
);

productRoute.get('/getProduct/:id', authAdmin, async (req, res) => {
  let data = {
    ...req.userinfo,
    ...req.params,
  };
  let service = new Services();
  let resp = await service.getProduct(data);
  res.status(resp.status).json(resp);
});

productRoute.get('/get_All_Products', authAdmin, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllProducts(data);
  res.status(resp.status).json(resp);
});

productRoute.put(
  '/updateAllProductDetails/:id',
  authAdmin,
  uploadImage.single('image'),
  async (req, res) => {
    let data = {
      ...req.userInfo,
      ...req.params,
      ...req.body,
      ...req.file,
    };
    let service = new Services();
    let resp = await service.updateAllProductDetails(data);
    // let resps = await service.getProduct(data);
    res.status(resp.status).json(resp);
  }
);

productRoute.patch('/updateProduct/:id', authAdmin, async (req, res) => {
  let data = {
    ...req.userInfo,
    ...req.params,
    ...req.body,
  };
  let service = new Services();
  let resp = await service.updateProduct(data);
  // let resps = await service.getProduct(data);
  res.status(resp.status).json(resp);
});

productRoute.delete('/deleteProduct/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.deleteProduct(data);
  res.status(resp.status).json(resp);
});

///// ----- Admin route for getting a users reviews ----- /////
productRoute.get('/get_review/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.get_review(data);
  res.status(resp.status).json(resp);
});

///// ----- Admin route for getting all users reviews ----- /////
productRoute.get('/get_all_review', authAdmin, async (req, res) => {
  let service = new Services();
  let resp = await service.get_all_review();
  res.status(resp.status).json(resp);
});

///// ----- Admin route for deleting a user reviews ----- /////
productRoute.delete('/delete_review/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.delete_review(data);
  res.status(resp.status).json(resp);
});

///// ---- Image Uploaded to cloudinary ------ /////
uploadRoute.post(
  '/upload',
  uploadImage.single('image'),
  authAdmin,
  async (req, res) => {
    let data = { ...req.userInfo, ...req.body, ...req.file };
    let service = new Services();
    let resp = await service.uploadImage(data);
    res.status(resp.status).json(resp);
  }
);

uploadRoute.get('/getImage/:id', authAdmin, async (req, res) => {
  let data = {
    ...req.userinfo,
    ...req.params,
  };
  let service = new Services();
  let resp = await service.getImage(data);
  res.status(resp.status).json(resp);
});

uploadRoute.get('/get_All_Images', authAdmin, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.getAllImages(data);
  res.status(resp.status).json(resp);
});

module.exports = { productRoute, uploadRoute };
