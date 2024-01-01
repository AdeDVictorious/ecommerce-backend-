const express = require('express');
const authUser = require('../../middlewares/authUser');
const authAdmin = require('../../middlewares/authAdmin');
let crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;
let { Order, sequelize, Product, Cart } = require('./model');

let Services = require('./services');

orderRoute = express.Router();
paystackhook = express.Router();

// ///// ----- Example 1 ----- /////
// ///// ----- Users Route ----- /////
// orderRoute.post('/addOrder', authUser, async (req, res) => {
//   let data = { ...req.userInfo, ...req.body };
//   let service = new Services();
//   let resp = await service.addOrder(data);
//   res.status(resp.status).json(resp);
// });

///// ----- Example 2 ----- /////
// ///// ----- Users Route ----- /////
orderRoute.post('/add_Order', authUser, async (req, res) => {
  let data = { ...req.userInfo, ...req.body };
  let service = new Services();
  let resp = await service.add_Order(data);
  res.status(resp.status).json(resp);
});

orderRoute.get('/getOrder', authUser, async (req, res) => {
  let data = { ...req.userInfo };
  let service = new Services();
  let resp = await service.getOrder(data);
  res.status(resp.status).json(resp);
});

orderRoute.get('/getOrder/:id', authUser, async (req, res) => {
  let data = { ...req.userInfo };
  let data1 = { ...req.params };
  let service = new Services();
  let resp = await service.getOrderByID(data, data1);
  res.status(resp.status).json(resp);
});

orderRoute.get('/getAllOrders', authUser, async (req, res) => {
  let data = { ...req.query, ...req.userInfo };
  let service = new Services();
  let resp = await service.getAllOrders(data);
  res.status(resp.status).json(resp);
});

///// ----- Paystack webhook ----- /////
paystackhook.post('/paystack_hook', async (req, res) => {
  console.log(req.body, 'am inside the req.body');
  //validate event
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    let event = req.body;
    let success = event.event;
    let order_id = event.data.metadata.custom_fields[2].value;
    let userId = event.data.metadata.UserId;
    let status = event.data.status;

    console.log(success, order_id);

    // Do something with event
    if (success === 'charge.success') {
      let getOne = await Order.update(
        { paymentStatus: status },
        {
          where: {
            id: order_id,
            UserId: userId,
          },
        }
      );

      ///// ----- get All productId & quantity inside the Carts ----- /////
      const getAllItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "ProductId" , "Cart_Tables".quantity, "Cart_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "UserId" = ?`;

      let getAll = await sequelize.query(getAllItem, {
        replacements: [userId],
        type: QueryTypes.SELECT,
      });

      ///// --- loop through cart record and subtractQty = ProductQty - CartQty ----- /////
      let ProductAndQty = [];

      for (let cart of getAll) {
        let cart_id = cart.id;
        let productId = cart.ProductId;
        let cartQty = cart.quantity;

        let ProductQty = await Product.findOne({ where: { id: productId } });

        let subtractQty = ProductQty.quantity - cartQty;

        let updateRec = await Product.update(
          { quantity: subtractQty },
          { where: { id: productId } }
        );
        console.log(cart_id, ' cart_id');

        ///// ----- Delete the cart record ------ /////
        let deleteRec = await Cart.destroy({
          where: { id: cart_id, UserId: userId },
        });

        ProductAndQty.push(deleteRec);
      }
    }
  }

  res.sendStatus(200);

  // let data = { ...req.body };
  // let service = new Services();
  // let resp = await service.paystackhook(data);
  // console.log(resp, 'I Am with resp');
  // res.status(resp).json(resp);
});

orderRoute.get('/paystack_verify/:id', authUser, async (req, res) => {
  let data = { ...req.params };
  let data1 = { ...req.userInfo };
  let service = new Services();
  let resp = await service.verifyPayment(data, data1);
  res.status(resp.status).json(resp);
});

///// ----- Admin Route ---- /////

//// --- PAYSTACK SECTION ----- /////
orderRoute.get('/paystack_verify/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let data1 = { ...req.userInfo };
  let service = new Services();
  let resp = await service.verifyPaymentByID(data, data1);
  res.status(resp.status).json(resp);
});

orderRoute.get('/paystack_verify_payment/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.verify_Payment(data);
  res.status(resp.status).json(resp);
});

orderRoute.get('/AllPaystack_payment', authAdmin, async (req, res) => {
  // let data = { ...req.params };
  let service = new Services();
  let resp = await service.AllPaystackPyt();
  res.status(resp.status).json(resp);
});

///// This Route is to update the payment status to success/failed by the Admin using the OrderId /////
orderRoute.patch('/updateOrder/:id', authAdmin, async (req, res) => {
  let data = { ...req.params, ...req.body };
  let service = new Services();
  let resp = await service.updateOrder(data);
  res.status(resp.status).json(resp);
});

orderRoute.get('/selectAll', authAdmin, async (req, res) => {
  let data = { ...req.query };
  let service = new Services();
  let resp = await service.selectAll(data);
  res.status(resp.status).json(resp);
});

///// ----- Use this route carefully ---- ////
orderRoute.delete('/deleteOrder/:id', authAdmin, async (req, res) => {
  let data = { ...req.params };
  let service = new Services();
  let resp = await service.deleteOrder(data);
  res.status(resp.status).json(resp);
});

module.exports = { orderRoute, paystackhook };
