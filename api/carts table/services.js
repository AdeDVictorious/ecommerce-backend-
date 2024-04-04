const { Op, QueryTypes } = require('sequelize');
const { Product, Cart, Location, sequelize } = require('./model');

class Services {
  /// ----- Users Route ----- /////
  async addCart(data) {
    try {
      // Check if product quantity is not = 0
      let getProd = await Product.findOne({
        where: { id: data.product_TableId },
      });

      if (getProd.quantity < 1) {
        return {
          status: 404,
          message: 'This product is currently not available',
        };
      } else if (data.quantity > getProd.quantity) {
        return {
          status: 404,
          message: 'quantities is greater than avaliable quantities',
        };
      } else if (!getProd) {
        return {
          status: 404,
          message: 'This product is not found',
        };
      }

      ////check if product exist in cart
      let getProduct = await Cart.findOne({
        where: { product_TableId: data.product_TableId, UserId: data.id },
      });

      if (getProduct) {
        // if exist add 1 to existing product quantity
        let addproduct = getProduct.quantity + data.quantity;

        let updateProd = await Cart.update(
          { quantity: addproduct },
          { where: { product_TableId: data.product_TableId, UserId: data.id } }
        );

        return {
          status: 200,
          message: 'Cart has been updated successfully',
        };
      } else {
        //if not add product to cart
        let addToCart = await Cart.create({
          product_TableId: data.product_TableId,
          quantity: data.quantity,
          UserId: data.id,
        });

        /// let get all item inside the cart /////
        let cartLength = await Cart.findAll({
          where: { UserId: data.id },
        });

        // response back to user
        return {
          status: 201,
          message: 'Item has been added to cart successfully',
          cart_length: cartLength.length,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Cart ' };
    }
  }

  async addToCart(data) {
    try {
      // Check if product quantity is not = 0
      let getProd = await Product.findOne({
        where: { id: data.product_TableId },
      });

      if (getProd.quantity < 1) {
        return {
          status: 404,
          message: 'This product is currently not available',
        };
      } else if (!getProd) {
        return {
          status: 404,
          message: 'This product is not found',
        };
      }

      //// check if the product exist inside the carts
      let checkCart = await Cart.findOne({
        where: { product_TableId: getProd.id, UserId: data.id },
      });

      if (checkCart && data.quantity === undefined) {
        // if exist add 1 to existing product quantity
        let value = 1;

        let addproduct = checkCart.quantity + value;

        let updateProd = await Cart.update(
          { quantity: addproduct },
          { where: { product_TableId: data.product_TableId, UserId: data.id } }
        );

        return {
          status: 200,
          message: 'Cart has been updated successfully',
        };
      } else {
        let value = 1;

        /// let create  a new cart item /////
        let addToCart = await Cart.create({
          product_TableId: getProd.id,
          quantity: value,
          UserId: data.id,
        });

        /// let get all item inside the cart /////
        let cartLength = await Cart.findAll({
          where: { UserId: data.id },
        });

        // response back to user
        return {
          status: 201,
          message: 'Item has been created to cart successfully',
          cart_length: cartLength.length,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding a Cart' };
    }
  }

  async substract_cartQty(data) {
    try {
      // Check if product quantity is not = 0
      let getProd = await Product.findOne({
        where: { id: data.product_TableId },
      });

      if (getProd.quantity < 1) {
        return {
          status: 404,
          message: 'This product is currently not available',
        };
      }

      if (!getProd) {
        return {
          status: 404,
          message: 'This product is not found',
        };
      }

      //// check if the product exist inside the carts
      let checkCart = await Cart.findOne({
        where: { product_TableId: getProd.id, UserId: data.id },
      });

      if (checkCart && data.quantity === undefined) {
        // if exist add 1 to existing product quantity
        let value = 1;

        let addproduct = checkCart.quantity - value;

        let updateProd = await Cart.update(
          { quantity: addproduct },
          { where: { product_TableId: data.product_TableId, UserId: data.id } }
        );

        console.log(updateProd);
        return {
          status: 200,
          message: 'Cart has been updated successfully',
        };
      } else {
        let value = 1;

        /// let create  a new cart item /////
        let addToCart = await Cart.create({
          product_TableId: getProd.id,
          quantity: value,
          UserId: data.id,
        });

        /// let get all item inside the cart /////
        let cartLength = await Cart.findAll({
          where: { UserId: data.id },
        });

        // response back to user
        return {
          status: 201,
          message: 'Item has been created to cart successfully',
          cart_length: cartLength.length,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding a Cart' };
    }
  }

  async getCartItem(data, data1) {
    try {
      const getCartItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price,  ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total","Cart_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "Cart_Tables".id = ? And "UserId" = ? `;

      let getOne = await sequelize.query(getCartItem, {
        replacements: [data.id, data1.id],
        type: QueryTypes.SELECT,
      });

      ////  if Item does not exist in the cart
      if (getOne.length == 0) {
        return {
          status: 404,
          message: `Item with ID ${data1.id} is not found`,
        };
      }
      //return responses to the users
      return {
        status: 200,
        message: 'Cart Item found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting cart item ' };
    }
  }

  async getAllCart(data) {
    try {
      const getAllItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price, ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total", "Cart_Tables"."UserId", "Cart_Tables"."createdAt" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "UserId" = ? ORDER BY "Cart_Tables"."createdAt" DESC LIMIT 30 `;

      let getAll = await sequelize.query(getAllItem, {
        replacements: [data.id],
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: 'All cart items found successfully',
        dbCount: getAll.length,
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Cart' };
    }
  }

  ///// ----- Example 2 ----- //////
  async get_delivery_fee(data, data1) {
    try {
      ///// ----- get total quantity ----- /////
      let sumQty = await Cart.sum('quantity', { where: { UserId: data.id } });

      if (!sumQty) {
        return { status: 404, message: 'Cart cannot be empty' };
      }

      const getAllItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price, ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total", "Cart_Tables"."UserId", "Cart_Tables"."createdAt" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id WHERE "UserId" = ?`;

      let getAll = await sequelize.query(getAllItem, {
        replacements: [data.id],
        type: QueryTypes.SELECT,
      });

      ///// -----  get the Location base on the Id seleted ----- /////
      let getLocation = await Location.findOne({
        where: { id: data1.id },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });

      ///// ----- Calculate the total_shipping cost ----- //////
      let shipping = getLocation.shipping;
      let qty = sumQty;
      let total_shipping = Number(shipping) * Number(qty);

      // get the actual_totals, multiplication of the quantity and the location & sum all the row together //
      let parallePrice = [];

      for (let cart of getAll) {
        let actualTotals = cart.actual_total;
        let quantity = cart.quantity;
        let shipping = getLocation.shipping;
        let shipping_Fee = quantity * shipping;
        let row_total = Number(actualTotals) + Number(shipping_Fee);
        parallePrice.push(row_total);
      }

      ///// ----- Sum all the column together ----- /////
      function sumArray(parallePrice) {
        let sum = 0;
        for (let i = 0; i < parallePrice.length; i++) {
          if (typeof parallePrice[i] === 'number') {
            sum += parallePrice[i];
          }
        }
        return sum;
      }

      let column_sum = sumArray(parallePrice);

      ///// ----- Get actual_total = Columntotal - total_shipping ----- /////
      let actual_sum = column_sum - total_shipping;

      return {
        status: 200,
        message: 'All cart items found successfully',
        sub_total: actual_sum,
        total_shippingFee: total_shipping,
        grandTotal: column_sum,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Cart' };
    }
  }

  async updateCart(data) {
    try {
      console.log(data);
      let getOne = await Cart.findOne({
        where: { id: data.id },
        attributes: { exclude: ['UserId', 'createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 400,
          message: `This Cart ${data.id} does not exist `,
        };
      }
      if (data.quantity < 1) {
        let cart = await Cart.destroy({
          where: { id: data.id },
        });

        return { status: 204, message: 'Item has been removed from cart' };
      }

      let updateCart = await Cart.update(
        { quantity: data.quantity },
        {
          where: { id: data.id },
        }
      );

      let updateRec = await Cart.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Cart updated successfully',

        updateRec,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error updating Cart ' };
    }
  }

  async deleteCart(data) {
    console.log(data);
    try {
      let deleteCart = await Cart.destroy({
        where: { id: data.id },
      });
      if (!deleteCart) {
        return {
          status: 404,
          message: 'Item with this ID was not found',
        };
      }
      return { status: 204, message: 'Cart deleted successfully ' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error deleting Cart ' };
    }
  }

  ///// ----- Admin Route ----- /////
  //// ----- Find All Items added by all users into the Carts ----- /////
  async getAllCartsItem() {
    try {
      const getCartItem = `SELECT "Cart_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables"."bottleSize" , "Product_Tables".description,  "Cart_Tables".quantity, "Product_Tables".price,  ("Cart_Tables".quantity * "Product_Tables".price) AS "actual_total","Cart_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Cart_Tables" ON "Cart_Tables"."product_TableId" = "Product_Tables".id `;

      let getOne = await sequelize.query(getCartItem, {
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: 'Cart Item found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting cart item ' };
    }
  }
}

module.exports = Services;
