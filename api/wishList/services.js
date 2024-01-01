const { Op, QueryTypes } = require('sequelize');
const { Product, Wishlist, sequelize } = require('./model');

class Services {
  /// ----- Users Route ----- /////
  async addWishlist(data) {
    console.log(data);
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
          message: 'This product is not available',
        };
      }

      ////check if product exist in Wishlist
      let getProduct = await Wishlist.findOne({
        where: { Product_TableId: data.product_TableId, UserId: data.id },
      });

      if (getProduct) {
        return {
          status: 200,
          message: 'Wishlist item already exist',
        };
      } else {
        //if not add product to Wishlist
        let addToWishlist = await Wishlist.create({
          Product_TableId: data.product_TableId,
          UserId: data.id,
        });

        // response back to user
        return {
          status: 201,
          message: 'Item has been added to Wishlist successfully',
          addToWishlist,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding a Wishlist ' };
    }
  }

  async getWishlist(data, data1) {
    try {
      const getWishlistItem = `SELECT "Wishlist_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables".quantity, "Product_Tables".price, "Wishlist_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Wishlist_Tables" ON "Wishlist_Tables"."Product_TableId" = "Product_Tables".id WHERE "Wishlist_Tables".id = ? And "UserId" = ? `;

      let getOne = await sequelize.query(getWishlistItem, {
        replacements: [data.id, data1.id],
        type: QueryTypes.SELECT,
      });

      ////  if Item does not exist in the Wishlist
      if (getOne.length == 0) {
        return {
          status: 404,
          message: 'Item with this ID is not found',
        };
      }
      //return responses to the users
      return {
        status: 200,
        message: 'Wishlist Item found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting Wishlist item ' };
    }
  }

  async getAllWishlist(data) {
    try {
      const getAllItem = `SELECT "Wishlist_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables".quantity, "Product_Tables".price, "Wishlist_Tables"."UserId", "Wishlist_Tables"."createdAt" FROM "Product_Tables" INNER JOIN "Wishlist_Tables" ON "Wishlist_Tables"."Product_TableId" = "Product_Tables".id WHERE "UserId" = ? ORDER BY "Wishlist_Tables"."createdAt" DESC LIMIT 30 `;

      let getAll = await sequelize.query(getAllItem, {
        replacements: [data.id],
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: 'All Wishlist items found successfully',
        dbCount: getAll.length,
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Wishlist' };
    }
  }

  async get_All_Wishlist(data) {
    try {
      const getAllItem = `SELECT "Wishlist_Tables".id, "Product_Tables".id AS "Product_TableId", "Product_Tables".name, "Product_Tables".image, "Product_Tables".quantity, "Product_Tables".price, ("Wishlist_Tables".quantity * "Product_Tables".price) AS "actual_total", "Wishlist_Tables"."UserId" FROM "Product_Tables" INNER JOIN "Wishlist_Tables" ON "Wishlist_Tables"."Product_TableId" = "Product_Tables".id WHERE "UserId" = ? LIMIT 20 `;

      let getAll = await sequelize.query(getAllItem, {
        replacements: [data.id],
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: 'All Wishlist items found successfully',
        dbCount: getAll.length,
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Wishlist' };
    }
  }

  async deleteWishlist(data) {
    console.log(data);
    try {
      let deleteWishlist = await Wishlist.destroy({
        where: { id: data.id },
      });

      if (!deleteWishlist) {
        return {
          status: 404,
          message: 'The Item with ID is not found',
        };
      }

      return { status: 204, message: 'Wishlist deleted successfully ' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error deleting Wishlist ' };
    }
  }
}

module.exports = Services;
