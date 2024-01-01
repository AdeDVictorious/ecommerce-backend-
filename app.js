const express = require('express');
const db = require('./db');

const dotenv = require('dotenv');

let cors = require('cors');

let app = express();

dotenv.config({ path: 'config.env' });

app.use(cors());

let {
  signupRoute,
  loginRoute,
  forgetPwdRoute,
  resetPwdRoute,
} = require('./api/users/authController');

let {
  adminSignupRoute,
  adminLoginRoute,
  adminForgetPwdRoute,
  adminResetPwdRoute,
} = require('./api/Admin/authController');

let usersRoute = require('./api/users/controller');
let { productRoute, uploadRoute } = require('./api/product/controller');
let cartRoute = require('./api/carts table/controller');
let wishlistRoute = require('./api/wishList/controller');
let locationRoute = require('./api/location/controller');
let { orderRoute, paystackhook } = require('./api/orders/controller');
let paymentRoute = require('./api/payment/controller');
let contactUsRoute = require('./api/contactUs/controller');

let adminRoute = require('./api/Admin/controller');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/v1', signupRoute, loginRoute, forgetPwdRoute, resetPwdRoute);

app.use(
  '/api/v1/admin',
  adminSignupRoute,
  adminLoginRoute,
  adminForgetPwdRoute,
  adminResetPwdRoute
);

app.use('/api/v1', usersRoute);
app.use('/api/v1/product', productRoute, uploadRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1', paystackhook);
app.use('/api/v1', contactUsRoute);

app.use('/api/v1/location', locationRoute);

app.use('/api/v1/', adminRoute);
app.use('/api/v1/payment', paymentRoute);

app.get('*', (req, res) => {
  res.send({ status: 404, message: `Page ${req.path} not found` });
});

let PORT = process.env.PORT;

app.listen(PORT, (err, res) => {
  if (err) {
    console.log(err, 'connection was not successfully');
  } else {
    console.log(`app is running on port: ${PORT}`);
  }
});
