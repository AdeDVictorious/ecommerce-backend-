const { Op, QueryTypes } = require('sequelize');
let { Product, Upload, sequelize, Review } = require('./model');
const cloudinary = require('../../middlewares/cloudImage');

// let { QueryTypes } = require('sequelize');

class Services {
  ///// ----- Dashboard Route Anyone can view ----- /////
  async dashboard(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Product' };
    }
  }

  async bestSelling(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: [['createdAt', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Product' };
    }
  }

  async varities(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: sequelize.random(),
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Product' };
    }
  }

  async previewProduct(data) {
    try {
      let getOne = await Product.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: 'Product with this ID not found',
        };
      }

      return {
        status: 200,
        message: 'Product found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Product ' };
    }
  }

  async query_search(data) {
    console.log(data.search_query);
    try {
      let query = `SELECT * FROM "Product_Tables" WHERE  name LIKE :name `;

      let searchResult = await sequelize.query(query, {
        replacements: { name: `%${data.search_query}%` },
        type: QueryTypes.SELECT,
      });

      // console.log(searchResult, searchResult.length);

      // console.log(searchResult);

      return {
        status: 200,
        message: 'Product found successfully',
        dbCount: searchResult.length,
        data: searchResult,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Product ' };
    }
  }

  ///// ----- Users Route ----- /////
  async getAllProduct(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: 'Page does not exit' };
      }

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all product' };
    }
  }

  async getBestSelling(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: [['createdAt', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: 'Page does not exit' };
      }

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all product' };
    }
  }

  async getVarities(data) {
    try {
      let { page } = data;
      let size = 6;

      let getAll = await Product.findAndCountAll({
        order: sequelize.random(),
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Product' };
    }
  }

  ///// ----- Users Route ----- /////
  async getShop(data) {
    try {
      let { page } = data;
      let size = 16;

      let getAll = await Product.findAndCountAll({
        order: [['priority', 'DESC']],
        // order: sequelize.random(),
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: 'Page does not exit' };
      }

      let pageFig = Number(page);
      console.log(pageFig);

      return {
        status: 200,
        message: 'All Product found successfully',
        pageNum: pageFig,
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all product' };
    }
  }

  ///// ----- Users Route ----- /////
  async ShopByPage(data) {
    try {
      let pageValue = data.page;
      let size = 16;

      let page = Number(pageValue);

      let getAll = await Product.findAndCountAll({
        order: [['priority', 'DESC']],
        // order: sequelize.random(),
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: 'Page does not exit' };
      }

      let pageFig = Number(page);

      return {
        status: 200,
        message: 'All Product found successfully',
        pageNum: pageFig,
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all product' };
    }
  }

  async getProductPreview(data) {
    try {
      let getOne = await Product.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: 'Product with this ID was not found',
        };
      }

      return {
        status: 200,
        message: 'Product found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Product ' };
    }
  }

  ///// ----- Another way of writing the code above ----- /////
  // async getProductPreview(data) {
  //   try {
  //     let getOne = await Product.findOne({
  //       where: { id: data.id },
  //       include: [
  //         {
  //           model: Review,
  //           where: {
  //             Product_TableId: data.id,
  //           },
  //         },
  //       ],
  //       attributes: { exclude: ['createdAt', 'updatedAt'] },
  //     });

  //     if (!getOne) {
  //       return {
  //         status: 404,
  //         message: 'Product with this ID was not found',
  //       };
  //     }

  //     console.log(getOne, 'This is the review attached');

  //     return {
  //       status: 200,
  //       message: 'Product found successfully',
  //       data: getOne,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //     return { status: 404, message: 'Error getting one Product ' };
  //   }
  // }

  ///// / ----- Users shopping review ----- /////
  async post_review(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        if (
          !data.custName ||
          !data.custEmail ||
          !data.custRating ||
          !data.custMessage
        ) {
          return { status: 400, message: ' All field must be entered' };
        }

        let custName = data.custName;
        let custEmail = data.custEmail;
        let custRating = data.custRating;
        let custMessage = data.custMessage;

        //Validate User custName for non-alphabet
        function validateName(custName) {
          const regex = /^[0-9A-Za-z\s\.,#-]+$/;
          return regex.test(custName);
        }

        if (validateName(custName)) {
          // The input contains only alphabet letters
        } else {
          return { status: 400, message: 'only alphabet is allowed' };
        }

        //Validate if User email is valid
        function validateForm(custEmail) {
          const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return regex.test(custEmail);
        }

        // To validate if email is valid
        if (validateForm(custEmail)) {
          // console.log(Email is valid);
        } else {
          return { status: 400, message: 'enter a valid email' };
        }

        //Validate User lastName for numbers
        function validateMessage(custMessage) {
          const regex = /^[0-9A-Za-z\s\.,#-]+$/;
          return regex.test(custMessage);
        }

        ///// ----- To validate if customer Subkect  ----- /////
        if (validateMessage(custMessage)) {
          // The input contains only alphabet letters
        } else {
          // The input contains non-alphabet characters
          return { status: 400, message: 'only alphabet is allowed' };
        }

        // ----- send data to db ----- //
        let addReview = await Review.create(
          {
            custName: custName,
            custEmail: custEmail,
            custRating: custRating,
            custMessage: custMessage,
            Product_TableId: data.product_ID,
            UserId: data.id,
          },
          { transaction: t }
        );

        return {
          status: 201,
          message: 'Review posted successfully',
        };
      });
      return { status: 201, result };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error posting a Product review' };
    }
  }

  ///// ----- Admin Route ----- /////
  async addProduct(data) {
    // console.log(data.myUUID, 'here @ data 2');
    try {
      const result = await sequelize.transaction(async (t) => {
        if (
          !data.name ||
          !data.path ||
          !data.bottleSize ||
          !data.description ||
          !data.quantity ||
          !data.price ||
          !data.priority
        ) {
          return { status: 400, message: ' All field must be entered' };
        }

        let getOne = await Product.findOne({
          where: { name: data.name },
        });

        if (getOne) {
          return {
            status: 400,
            message: `Product with this name already exist`,
          };
        }
        // ---- Save image to cloud ---- //
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        };

        const result = await cloudinary.uploader.upload(data.path, options);
        console.log(result);

        let image = result.url;

        // ----- send data to db ----- //
        let addProduct = await Product.create(
          {
            name: data.name,
            image: image,
            bottleSize: data.bottleSize,
            description: data.description,
            quantity: data.quantity,
            price: data.price,
            priority: data.priority,
          },
          { transaction: t }
        );

        return {
          status: 201,
          message: 'Product added successfully',
          data: addProduct,
        };
      });
      return { status: 201, result };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error adding a Product ' };
    }
  }

  async getProduct(data) {
    try {
      let getOne = await Product.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: `Product with ID ${data.id} not found`,
        };
      }

      return {
        status: 200,
        message: 'Product found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting one Product ' };
    }
  }

  async getAllProducts(data) {
    try {
      let { page } = data;
      let size = 10;

      let getAll = await Product.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: 'This page does not exit' };
      }

      return {
        status: 200,
        message: 'All Product found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Product' };
    }
  }

  async updateAllProductDetails(data) {
    console.log(data);
    try {
      let getOne = await Product.findOne({
        where: { id: data.id },
      });

      if (!getOne) {
        return {
          status: 400,
          message: `This Product ${data.id} does not exist `,
        };
      }

      // ---- Save image to cloud ---- //
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      const result = await cloudinary.uploader.upload(data.path, options);
      console.log(result);

      let image = result.url;

      let updateProduct = await Product.update(
        {
          name: data.name,
          image: image,
          bottleSize: data.bottleSize,
          description: data.description,
          quantity: data.quantity,
          price: data.price,
          priority: data.priority,
        },
        { where: { id: data.id } }
      );

      let update = await Product.findOne({
        where: { id: data.id },
      });

      return {
        status: 200,
        message: 'Product updated successfully',
        update,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error updating Product ' };
    }
  }

  async updateProduct(data) {
    try {
      let getOne = await Product.findOne({
        where: { id: data.id },
      });

      if (!getOne) {
        return {
          status: 400,
          message: `This Product ${data.id} does not exist `,
        };
      }

      let updateProduct = await Product.update(
        {
          name: data.name,
          quantity: data.quantity,
          bottleSize: data.bottleSize,
          price: data.price,
          priority: data.priority,
        },
        { where: { id: data.id } }
      );

      let update = await Product.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Product updated successfully',
        update,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error updating Product ' };
    }
  }

  async deleteProduct(data) {
    try {
      let deleteProduct = await Product.destroy({
        where: { id: data.id },
      });
      return { status: 204, message: 'Product deleted successfully ' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error deleting Product ' };
    }
  }

  async get_review(data) {
    try {
      let get_review = await Review.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!get_review) {
        return { status: 404, message: 'review with this id is not found' };
      }

      return {
        status: 200,
        message: 'Product review found successfully',
        data: get_review,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting Product review' };
    }
  }

  async get_all_review(data) {
    try {
      let all_reviews = await Review.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'All Product reviews found successfully',
        data: all_reviews,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Product reviews ' };
    }
  }

  async delete_review(data) {
    try {
      let delete_review = await Review.destroy({
        where: { id: data.id },
      });

      if (!delete_review) {
        return { status: 404, message: 'review with this id is not found' };
      }

      return { status: 204, message: 'Product review deleted successfully ' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error deleting Product ' };
    }
  }

  ///// ----- Image uploaded to Cloudinary- Sections ----- //////
  async uploadImage(data) {
    try {
      let getOne = await Upload.findOne({
        where: { name: data.name },
      });

      if (getOne) {
        return {
          status: 400,
          message: `Image with this name already exist`,
        };
      }

      // ---- Save image to cloud ---- //
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      const result = await cloudinary.uploader.upload(data.path, options);

      let publicId = result.public_id;

      // ----- send data to db ----- //
      let addImage = await Upload.create({
        name: data.name,
        public_id: publicId,
      });

      return {
        status: 201,
        message: 'Upload was successfully',
        data: addImage,
      };
    } catch (error) {
      console.error(error);
      return { status: 404, message: 'Error uploading image' };
    }
  }

  async getImage(data) {
    try {
      let getOne = await Upload.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: `Image with ID ${data.id} not found`,
        };
      }

      return {
        status: 200,
        message: 'Image found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting image' };
    }
  }

  async getAllImages(data) {
    try {
      let { page } = data;
      let size = 10;

      let getAll = await Upload.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (getAll.rows < getAll.count) {
        return { status: 404, message: `Page ${page} does not exit` };
      }

      return {
        status: 200,
        message: 'All Image found successfully',
        totalPage: Math.ceil(getAll.count / size),
        data: getAll,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error getting all Images' };
    }
  }
}

module.exports = Services;
