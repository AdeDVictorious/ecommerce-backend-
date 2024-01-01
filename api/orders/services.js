let { QueryTypes } = require('sequelize');
let {
  Order,
  sequelize,
  Location,
  Cart,
  User,
  Payment,
  Product,
} = require('./model');
let axios = require('axios');

class Services {
  /// ----- Users Route ----- /////
  ///// ----- example 1 ----- /////
  // ///// ----- To add transaction to this point ----- /////
  // async addOrder(data) {
  //   try {
  //     ///// ----- get total quantity ----- /////
  //     let sumQty = await Cart.sum('quantity', { where: { UserId: data.id } });

  //     if (!sumQty) {
  //       return { status: 404, message: 'Cart cannot be empty' };
  //     }

  //     const result = await sequelize.transaction(async (t) => {
  //       ///// ----- Check if order exist inside the database ----- /////
  //       ///// ----- get All item inside the Car ----- /////
  //       const getAllItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price, ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total","Cart_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "UserId" = ?`;

  //       let getAll = await sequelize.query(getAllItem, {
  //         replacements: [data.id],
  //         type: QueryTypes.SELECT,
  //       });

  //       ///// -----  get the Location base on the Id seleted ----- /////
  //       let getLocation = await Location.findOne({
  //         where: { id: data.locationId },
  //         attributes: {
  //           exclude: ['createdAt', 'updatedAt'],
  //         },
  //       });

  //       ///// ----- Calculate the total_shipping cost ----- //////
  //       let shipping = getLocation.shipping;
  //       let qty = sumQty;
  //       let totalShipping = Number(shipping) * Number(qty);

  //       // get the actual_totals, multiplication of the quantity and the location & sum all the row together //
  //       let parallePrice = [];

  //       for (let cart of getAll) {
  //         let actualTotals = cart.actual_total;
  //         let quantity = cart.quantity;
  //         let shipping = getLocation.shipping;
  //         let shipping_Fee = quantity * shipping;
  //         let row_total = Number(actualTotals) + Number(shipping_Fee);
  //         parallePrice.push(row_total);
  //       }

  //       ///// ----- Sum all the column together ----- /////
  //       function sumArray(parallePrice) {
  //         let sum = 0;
  //         for (let i = 0; i < parallePrice.length; i++) {
  //           if (typeof parallePrice[i] === 'number') {
  //             sum += parallePrice[i];
  //           }
  //         }
  //         return sum;
  //       }

  //       let columnSum = sumArray(parallePrice);

  //       ///// ----- Get actual_total = Columntotal - total_shipping ----- /////
  //       let actualSum = columnSum - totalShipping;

  //       ///// ----- Save it to the database ----- /////
  //       let saveOrder = await Order.create(
  //         {
  //           goodsOrder: getAll,
  //           total_quantities: sumQty,
  //           sub_total: actualSum,
  //           total_shippingFee: totalShipping,
  //           grandTotal: columnSum,
  //           locationId: data.locationId,
  //           address: data.address,
  //           UserId: data.id,
  //         },
  //         { transaction: t }
  //       );

  //       ///// ----- Let find User email ----- /////
  //       let user = await User.findOne({
  //         where: { id: data.id },
  //         attributes: {
  //           exclude: ['password', 'createdAt', 'updatedAt'],
  //         },
  //       });

  //       ///// ---- Payment platform Integrations ----- /////
  //       ///// ----- Paystack Entry point ----- /////
  //       const params = {
  //         email: user.email,
  //         amount: columnSum * 100,
  //         metadata: {
  //           UserId: data.id,
  //           custom_fields: [
  //             {
  //               display_name: 'Last Name',
  //               variable_name: 'lastName',
  //               value: user.lastName,
  //             },
  //             {
  //               display_name: 'First Name',
  //               variable_name: 'firstName',
  //               value: user.firstName,
  //             },
  //             {
  //               display_name: 'Order_id',
  //               variable_name: 'OrderId',
  //               value: saveOrder.id,
  //             },
  //           ],
  //           // cancel_action: 'https://j611903z-8080.uks1.devtunnels.ms/',
  //         },
  //       };

  //       const config = {
  //         baseURL: `${process.env.BASE_URL}`,
  //         headers: {
  //           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  //           'Content-Type': 'application/json',
  //         },
  //       };

  //       const response = await axios.post(
  //         '/transaction/initialize',
  //         params,
  //         config
  //       );

  //       let paystackURL = response.data.data.authorization_url;
  //       let paystackRef = response.data.data.reference;

  //       //add the payment info to db
  //       let add = await Payment.create(
  //         {
  //           PaymentId: paystackRef,
  //           paystackURL: paystackURL,
  //           OrderTableId: saveOrder.id,
  //           amount: columnSum,
  //           UserId: user.id,
  //         },
  //         { transaction: t }
  //       );
  //       ///// ----- Send responses to Users ----- /////
  //       return {
  //         status: 201,
  //         message: 'Link generated',
  //         userData: user,
  //         location: getLocation,
  //         address: saveOrder.address,
  //         data: response.data,
  //         data1: saveOrder,
  //       };
  //     });

  //     return { status: 201, result };
  //   } catch (error) {
  //     console.log(error);
  //     return { status: 400, message: 'Error adding a Order ' };
  //   }
  // }

  /// ----- example 2 ----- /////
  ///// ----- To add transaction to this point ----- /////
  async add_Order(data) {
    try {
      ///// ----- get total quantity ----- /////
      let sumQty = await Cart.sum('quantity', { where: { UserId: data.id } });

      if (!sumQty) {
        return { status: 404, message: 'Cart cannot be empty' };
      }

      const result = await sequelize.transaction(async (t) => {
        ///// ----- get All item inside the Car ----- /////
        const getAllItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price, ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total","Cart_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "UserId" = ?`;

        let getAll = await sequelize.query(getAllItem, {
          replacements: [data.id],
          type: QueryTypes.SELECT,
        });

        let actualSum = data.sub_total;
        let totalShipping = data.total_shippingFee;
        let columnSum = data.grand_total;
        let locationId = data.locationId;
        let address = data.address;

        ///// ----- Save it to the database ----- /////
        let saveOrder = await Order.create(
          {
            goodsOrder: getAll,
            total_quantities: sumQty,
            sub_total: actualSum,
            total_shippingFee: totalShipping,
            grandTotal: columnSum,
            locationId: locationId,
            address: address,
            UserId: data.id,
          },
          { transaction: t }
        );

        ///// ----- Let find User email ----- /////
        let user = await User.findOne({
          where: { id: data.id },
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        });

        ///// ---- Payment platform Integrations ----- /////
        ///// ----- Paystack Entry point ----- /////
        const params = {
          email: user.email,
          amount: columnSum * 100,
          metadata: {
            UserId: data.id,
            custom_fields: [
              {
                display_name: 'Last Name',
                variable_name: 'lastName',
                value: user.lastName,
              },
              {
                display_name: 'First Name',
                variable_name: 'firstName',
                value: user.firstName,
              },
              {
                display_name: 'Order_id',
                variable_name: 'OrderId',
                value: saveOrder.id,
              },
            ],
            cancel_action: 'https://j611903z-8080.uks1.devtunnels.ms/',
          },
        };

        const config = {
          baseURL: `${process.env.BASE_URL}`,
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.post(
          '/transaction/initialize',
          params,
          config
        );

        let paystackURL = response.data.data.authorization_url;
        let paystackRef = response.data.data.reference;

        //add the payment info to db
        let add = await Payment.create(
          {
            PaymentId: paystackRef,
            paystackURL: paystackURL,
            OrderTableId: saveOrder.id,
            amount: columnSum,
            UserId: user.id,
          },
          { transaction: t }
        );
        ///// ----- Send responses to Users ----- /////
        return {
          status: 201,
          message: 'Link generated',
          userData: user,
          location: locationId,
          address: saveOrder.address,
          data: response.data,
          data1: saveOrder,
        };
      });

      return { status: 201, result };
    } catch (error) {
      console.log(error);
      return { status: 400, message: 'Error adding a Order ' };
    }
  }

  //// --- PAYSTACK SECTION ----- /////
  async verifyPayment(data, data1) {
    try {
      ///// find the payment reference from payment table /////
      let getRef = await Payment.findOne({
        where: { OrderTableId: data.id, UserId: data1.id },
      });

      if (!getRef) {
        return { status: 404, message: 'The payemnt reference is not found' };
      }

      let referID = getRef.PaymentId;

      //// Request the status of the transaction from Paystack
      const config = {
        baseURL: `${process.env.BASE_URL}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const response = await axios.get(
        `/transaction/verify/${referID}`,
        config
      );

      let userId = response.data.data.metadata.UserId;
      let status = response.data.data.status;
      let amount = response.data.data.amount;
      let order_id = response.data.data.metadata.custom_fields[2].value;

      if (data1.id != userId) {
        return { status: 404, message: 'Users ID not found' };
      } else if (data.id != order_id) {
        return { status: 404, message: 'Users OrderId not found' };
      }

      if (status === 'abandoned') {
        let getOne = await Order.update(
          { paymentStatus: 'pending' },
          { where: { id: data.id, UserId: data1.id } }
        );
        let getRec = await Order.findOne({
          where: { id: data.id, UserId: data1.id },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        return { status: 200, message: 'Payment status is pending', getRec };
      } else if (status === 'failed') {
        let getOne = await Order.update(
          { paymentStatus: 'failed' },
          { where: { id: data.id, UserId: data1.id } }
        );
        let getRec = await Order.findOne({
          where: { id: data1.id, UserId: data1.id },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        return {
          status: 200,
          message: 'failed transaction',
          data: getRec,
        };
      } else if (response.data.data.status === 'success') {
        let getOne = await Order.update(
          { paymentStatus: status },
          {
            where: {
              id: order_id,
              UserId: data1.id,
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

        // let deleteOne = await Cart.destroy({ where: { UserId: userId } });

        let findPayment = await Payment.findOne({
          where: { OrderTableId: order_id, UserId: userId },
        });

        if (findPayment) {
          ///// ----- Return responses to users  ----- /////
          const getUpdate = await Order.findOne({
            where: {
              id: order_id,
              UserId: userId,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          });

          return {
            status: 200,
            message:
              'Transaction was successful, this payment record has been saved already',
            getUpdate,
          };
        } else {
          //add the payment info to db
          let add = await Payment.create({
            PaymentId: getRef.PaymentId,
            OrderTableId: order_id,
            amount: amount / 100,
            UserId: userId,
          });

          ///// ----- Return responses to users  ----- /////
          const getUpdate = await Order.findOne({
            where: {
              id: order_id,
              UserId: userId,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          });

          return {
            status: 200,
            message: 'transaction was successful',
            getUpdate,
          };
        }
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);
      // console.log(error.response.data);
      return { status: 404, message: 'Error updating payment status' };
    }
  }

  async getOrder(data) {
    try {
      let getOne = await Order.findOne({
        where: { paymentStatus: 'pending', UserId: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: 'Order with ID not found',
        };
      }

      ///// ----- get user info ---- /////
      let userData = await User.findOne({
        where: { id: data.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      ///// ----- get user info ---- /////
      let location = await Location.findOne({
        where: { id: getOne.locationId },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Order found successfully',
        getOne,
        userData,
        location,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  async getOrderByID(data, data1) {
    try {
      let result = await Order.findOne({
        where: { id: data1.id, UserId: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!result) {
        return {
          status: 404,
          message: `Order with ID ${data1.id} not found`,
        };
      }

      ///// ----- get user info ---- /////
      let userData = await User.findOne({
        where: { id: data.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      ///// ----- get user info ---- /////
      let location = await Location.findOne({
        where: { id: result.locationId },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Order found successfully',
        result,
        userData,
        location,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  async getAllOrders(data) {
    try {
      // let { page } = data;
      // let size = 10;

      let getAll = await Order.findAndCountAll({
        order: [['createdAt', 'DESC']],
        where: { UserId: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        // limit: size,
        // offset: page * size,
      });

      return {
        status: 200,
        message: 'All Order found successfully',
        // totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Order' };
    }
  }

  //// --- PAYSTACK SECTION ----- /////
  ///// ----- Admin SECTION ----- //////
  async verifyPaymentByID(data, data1) {
    try {
      ///// find the payment reference from payment table /////
      let getRef = await Payment.findOne({
        where: { OrderTableId: data.id, UserId: data1.id },
      });

      if (!getRef) {
        return { status: 404, message: 'The payemnt reference is not found' };
      }

      let referID = getRef.PaymentId;

      console.log(referID);

      //// Request the status of the transaction from Paystack
      const config = {
        baseURL: `${process.env.BASE_URL}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const response = await axios.get(
        `/transaction/verify/${referID}`,
        config
      );

      let userId = response.data.data.metadata.UserId;
      let status = response.data.data.status;
      let amount = response.data.data.amount;
      let order_id = response.data.data.metadata.custom_fields[2].value;

      if (data1.id != userId) {
        return { status: 404, message: 'Users ID not found' };
      } else if (data.id != order_id) {
        return { status: 404, message: 'Users OrderId not found' };
      }

      if (status === 'abandoned') {
        let getOne = await Order.update(
          { paymentStatus: 'pending' },
          { where: { id: data.id, UserId: data1.id } }
        );
        let getRec = await Order.findOne({
          where: { id: data.id, UserId: data1.id },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        return { status: 200, message: 'Payment status is pending', getRec };
      } else if (status === 'failed') {
        let getOne = await Order.update(
          { paymentStatus: status },
          { where: { id: data.id, UserId: data1.id } }
        );
        let getRec = await Order.findOne({
          where: { id: data.id, UserId: data1.id },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        return {
          status: 200,
          message: 'failed transaction',
          data: getRec,
        };
      } else if (response.data.data.status == 'success') {
        let getOne = await Order.update(
          { paymentStatus: status },
          {
            where: {
              id: order_id,
              UserId: data1.id,
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

        // let deleteOne = await Cart.destroy({ where: { UserId: userId } });

        let findPayment = await Payment.findOne({
          where: { OrderTableId: order_id, UserId: userId },
        });

        if (findPayment) {
          ///// ----- Return responses to users  ----- /////
          const getUpdate = await Order.findOne({
            where: {
              id: order_id,
              UserId: userId,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          });

          return {
            status: 200,
            message:
              'Transaction was successful, this payment record has been saved already',
            getUpdate,
          };
        } else {
          //add the payment info to db
          let add = await Payment.create({
            PaymentId: getRef.PaymentId,
            OrderTableId: order_id,
            amount: amount / 100,
            UserId: userId,
          });

          ///// ----- Return responses to users  ----- /////
          const getUpdate = await Order.findOne({
            where: {
              id: order_id,
              UserId: userId,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          });

          return {
            status: 200,
            message: 'transaction was successful',
            getUpdate,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error updating payment status' };
    }
  }

  async AllPaystackPyt() {
    try {
      const config = {
        baseURL: 'https://api.paystack.co',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const response = await axios.get('/transaction', config);
      return {
        status: 200,
        message: 'payment was successful',
        dbCount: response.data.data.length,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  ///// ----- Admin SECTION ----- //////
  async verify_Payment(data) {
    try {
      const config = {
        baseURL: `${process.env.BASE_URL}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const response = await axios.get(
        `/transaction/verify/${data.id}`,
        config
      );

      return { status: 200, message: 'payment verified ', data: response.data };
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  ///// ----- Admin Route ---- /////
  ///// This Route is to update the payment status to success/failed by the Admin using the OrderId /////
  async updateOrder(data) {
    try {
      let getOne = await Order.findOne({
        where: { id: data.id },
      });

      if (!getOne) {
        return { status: 404, message: 'Order with ID not found' };
      }

      let updateRec = await Order.update(
        { paymentStatus: data.paymentStatus },
        { where: { id: data.id } }
      );

      let updated = await Order.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Order updated successfully',
        updated,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error updating Order ' };
    }
  }

  async deleteOrder(data) {
    try {
      let getOne = await Order.findOne({ where: { id: data.id } });

      if (!getOne) {
        return {
          status: 404,
          message: `Order with ID ${data.id} not found`,
        };
      }
      let deleteOrder = await Order.destroy({ where: { id: data.id } });

      return {
        status: 204,
        message: 'Order deleted successfully',
        deleteOrder,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error deleting Order ' };
    }
  }

  ///// ----- Query example ---- /////
  async selectAll(data) {
    try {
      let { page } = data;
      let size = 10;

      const getAll = await Order.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });
      return { status: 200, message: 'Orders found successfully', getAll };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error finding All Orders' };
    }
  }
}

module.exports = Services;
