const { Op } = require('sequelize');
let { User, Cart, ResetPwd, sequelize } = require('./model');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let sendEmail = require('../../middlewares/email');
const { product_review } = require('../../db');

class Services {
  async addNewUser(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        ///// ----- Check if the input is empty ----- //////
        if (
          !data.firstName ||
          !data.lastName ||
          !data.phoneNo ||
          !data.email ||
          !data.password
        ) {
          return { status: 404, message: 'All field must be filled' };
        }
        ///// ----- Check and validate user phone number ----- //////

        if (data.phoneNo.length > 11 || data.phoneNo.length < 11) {
          return { status: 404, message: 'Kindly confirm your phone number' };
        }

        ///// ----- Check if email address already exist ----- //////

        let checkEmail = await User.findOne({ where: { email: data.email } });

        if (checkEmail) {
          return { status: 404, message: 'This email has been used' };
        }

        ///// ----- Hash the password after all check is done ----- //////
        let hashPwd = await bcrypt.hash(data.password, 10);

        ///// ----- create users and save to database ----- //////
        let newUser = await User.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNo: data.phoneNo,
            email: data.email,
            password: hashPwd,
          },
          { transaction: t }
        );

        // ///// ----- Generate the logintoken and to the frontend ----- //////
        let loginToken = await jwt.sign(
          { id: newUser.id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        ///// ----- Return responses to the users ----- /////
        return {
          status: 201,
          message: 'New User added successfully',
          loginToken,
          userID: newUser.id,
        };
      });

      ///// ----- check the cart for item saved there ----- /////
      if (!data.cart || data.cart.length < 1) {
        ///// ----- Return responses to the users ----- /////
        return { status: 201, result };
      } else if (data.cart) {
        ///// ---- Add each item to the product
        for (let item of data.cart) {
          let product_TableId = item.Product_TableId;
          let quantity = item.quantity;

          let addToCart = await Cart.create({
            product_TableId: product_TableId,
            quantity: quantity,
            UserId: result.userID,
          });
        }

        return { status: 201, result };
      } else {
        ///// ----- Return responses to the users ----- /////
        return { status: 201, result };
      }
    } catch (err) {
      console.log(err);
      let message;
      err.errors.forEach((error) => {
        switch (error.validatorKey) {
          case 'isAlpha':
            message = 'Only Alphabets is allowed';
            break;
          case 'isEmail':
            message = 'Enter a valid email address';
            break;
          case 'not_unique':
            message = 'this email address has been used';
            break;
          case 'is_null':
            message = 'this field cannot be empty';
            break;
        }
        message = { [error.path]: message };
      });

      if (message) {
        return { status: 404, validationError: message };
      } else if (err) {
        console.log(err, ' Error adding new customer');
        return { status: 400, message: 'Error adding a new customer ' };
      }
    }
  }

  async loginUser(data) {
    try {
      if (!data.email || !data.password) {
        return { status: 404, message: 'Please provide email and password' };
      }

      let user = await User.findOne({
        where: { email: data.email },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });

      if (!user) {
        return { status: 404, message: 'User does not exist' };
      }

      let unhashPwd = await bcrypt.compare(data.password, user.password);

      if (!unhashPwd) {
        return { status: 404, message: 'Incorrect Password' };
      }

      let loginToken = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      let getUser = await User.findOne({
        where: { email: data.email },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      });

      ///// ----- check the cart for item saved there ----- /////
      if (!data.cart || data.cart.length < 1) {
        ///// ----- Return responses to the users ----- /////
        return {
          status: 200,
          message: 'User login Successfully',
          loginToken,
          getUser,
        };
      } else {
        ///// ---- Add each item to the product
        for (let item of data.cart) {
          let product_TableId = item.Product_TableId;
          let quantity = item.quantity;

          ////check if product exist in cart
          let getProduct = await Cart.findOne({
            where: { product_TableId: product_TableId, UserId: getUser.id },
          });

          if (getProduct) {
            // if exist add 1 to existing product quantity
            let addproduct = getProduct.quantity + quantity;

            let updateProd = await Cart.update(
              { quantity: addproduct },
              {
                where: {
                  product_TableId: product_TableId,
                  UserId: getUser.id,
                },
              }
            );
          } else {
            let addToCart = await Cart.create({
              product_TableId: product_TableId,
              quantity: quantity,
              UserId: getUser.id,
            });
          }
        }
        ///// ----- Return responses to the users ----- /////
        return {
          status: 200,
          message: 'User login Successfully',
          loginToken,
          getUser,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error logining User In' };
    }
  }

  ///// Still need a further editing for perfection
  async forgetPwd(data) {
    try {
      let user = await User.findOne({ where: { email: data.email } });
      if (!user) {
        return { status: 404, message: 'User does exist with this email' };
      }

      const result = await sequelize.transaction(async (t) => {
        // Encrypt
        const { createHmac } = await import('node:crypto');

        function generateRandomString(length) {
          const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let randomString = '';

          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
          }

          return randomString;
        }

        const randomString = generateRandomString(30);

        const secret = randomString;
        const hashToken = createHmac('sha256', secret)
          .update(process.env.HASH_UPDATE)
          .digest('hex');

        let expireTime = Date.now() + 10 * 60 * 1000;

        const resetToken = await ResetPwd.create(
          {
            token: hashToken,
            expirationDate: expireTime,
            UserId: user.id,
          },
          { transaction: t }
        );

        const resetURL = `https://j611903z-8000.uks1.devtunnels.ms/reset_password/${hashToken}`;

        let message = `Your password reset token is as follows:\n\n\n${resetURL}\n\n\n Click on the link, otherwise copy it into your browser. If you have not requested this email, kindly ignore.`;

        await sendEmail({
          email: user.email,
          subject: 'Your password reset token expires in 10 mins',
          message,
        });

        return { status: 200, message: 'Reset token sent to your email' };
      });

      return { status: 201, result };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error sending password reset link ' };
    }
  }

  async resetPwd(data) {
    try {
      // const result = await sequelize.transaction(async (t) => {
      let userToken = await ResetPwd.findOne({
        where: { token: data.token },
      });

      // if Token is wrong
      if (!userToken) {
        return { status: 400, message: 'Invalid token' };
      }

      // If Token has expired
      if (userToken.expirationDate <= Date.now()) {
        return { status: 400, message: ' Token has expired' };
      }

      let hashPwd = await bcrypt.hash(data.password, 10);

      let user = await User.update(
        { password: hashPwd },
        {
          where: {
            id: userToken.UserId,
          },
        }
        // { transaction: t }
      );
      //// ---- To match this and the one below later On as I advance ON how to use WHERE ------- ////////
      await ResetPwd.destroy({
        where: {
          createdAt: {
            [Op.lt]: new Date(new Date() - 10 * 60 * 1000),
          },
        },
        where: { token: userToken.token },
      });

      return { status: 200, message: 'Password reset was successfully' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error resetting password' };
    }
  }

  async get_profile(data) {
    try {
      let user = await User.findOne({
        where: {
          id: data.id,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      return {
        status: 200,
        message: 'User found Successfully',
        user,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching User' };
    }
  }

  //// ---- To work on this later for address Update ----////
  async updateMe(data) {
    try {
      let UpdateUser = await User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNo: data.phoneNo,
        },
        {
          where: {
            id: data.id,
          },
        }
      );

      return {
        status: 200,
        message: 'User updated Successfully',
        data: UpdateUser,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error Updating User' };
    }
  }

  /////------ Admin Route ------//////
  async getOneUser(data) {
    try {
      let findUser = await User.findOne({
        where: {
          id: data.id,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      if (!findUser) {
        return {
          status: 404,
          message: 'User with this ID is not found',
        };
      }

      return {
        status: 200,
        message: 'User found Successfully',
        data: findUser,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching User' };
    }
  }

  async getAllUsers(data) {
    try {
      let { page } = data;
      let size = 10;

      let users = await User.findAndCountAll({
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        limit: size,
        offset: page * size,
      });

      if (users.rows < users.count) {
        return { status: 404, message: 'This Page does not exit' };
      }

      return {
        status: 200,
        message: 'User found Successfully',
        totalPage: Math.ceil(users.count / size),
        data: users,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching all User' };
    }
  }

  async updateUser(data) {
    try {
      let findUser = await User.findOne({ where: { id: data.id } });

      if (!findUser) {
        return {
          status: 404,
          message: 'User with this ID does not not exist',
        };
      }

      let updateUser = await User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNo: data.phoneNo,
        },
        {
          where: {
            id: data.id,
          },
        }
      );

      return {
        status: 200,
        message: 'User updated Successfully',
        data: updateUser,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error Updating User' };
    }
  }

  async deleteUser(data) {
    try {
      let users = await User.destroy({
        where: { id: data.id },
      });

      return {
        status: 204,
        message: 'User deleted Successfully',
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error deleting a User' };
    }
  }

  //// to work on this later on
  async restoreUser(data) {
    try {
      let findUser = await User.findOne({ where: { email: data.email } });

      console.log(findUser.id);
      if (findUser.id) {
        let users = await User.restore(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          },
          { where: { id: user.id } }
        );

        return {
          status: 200,
          message: 'User restored Successfully',
          data: users,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error restoring User' };
    }
  }
}

module.exports = Services;
