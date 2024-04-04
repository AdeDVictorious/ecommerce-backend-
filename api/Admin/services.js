const { Op } = require('sequelize');
let { Admin, AdminResetPwd, sequelize } = require('./model');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let sendEmail = require('../../middlewares/email');

class Services {
  async addNewAdmin(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        if (
          !data.firstName ||
          !data.lastName ||
          !data.phoneNo ||
          !data.email ||
          !data.password
        ) {
          return { status: 404, message: 'All field must be filled' };
        }
        if (data.phoneNo.length > 11 || data.phoneNo.length < 11) {
          return { status: 404, message: 'Kindly confirm your phone number' };
        }
        let checkEmail = await Admin.findOne({ where: { email: data.email } });

        console.log(checkEmail, ' @ check Email');

        if (checkEmail) {
          return { status: 404, message: 'This email has been used' };
        }

        let hashPwd = await bcrypt.hash(data.password, 10);

        let newAdmin = await Admin.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNo: data.phoneNo,
            email: data.email,
            password: hashPwd,
          },
          { transaction: t }
        );

        let loginToken = await jwt.sign(
          { admindata: newAdmin },
          process.env.JWT_SECRET_CODE,
          {
            expiresIn: process.env.JWT_EXPIRES_IN_CODE,
          }
        );
        console.log(loginToken, ' @ newAdmin.id');
        return {
          status: 201,
          message: 'New Admin added successfully',
          loginToken,
        };
      });

      return { status: 201, result };
    } catch (err) {
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
        return { status: 400, validationError: message };
      } else if (err) {
        console.log(err, ' Error @ Add new Admin');
        return { status: 400, message: 'Error adding a new Admin ' };
      }
    }
  }

  async loginAdmin(data) {
    try {
      if (!data.email || !data.password) {
        return { status: 404, message: 'Please provide email and password' };
      }

      let admin = await Admin.findOne({ where: { email: data.email } });

      if (!admin) {
        return { status: 404, message: 'This account does not exist' };
      }

      let unhashPwd = await bcrypt.compare(data.password, admin.password);

      if (!unhashPwd) {
        return { status: 404, message: 'Incorrect Password' };
      }

      // console.log(process.env);
      let loginToken = await jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET_CODE,
        {
          expiresIn: process.env.JWT_EXPIRES_IN_CODE,
        }
      );

      return {
        status: 200,
        message: 'Admin login Successfully',
        loginToken,
      };
    } catch (err) {
      console.log(err, 'Error @ Login Admin ');
      return { status: 404, message: 'Error logining Admin In' };
    }
  }

  ///// Still need a further editing for perfection
  async forgetPwd(data) {
    try {
      let admin = await Admin.findOne({ where: { email: data.email } });
      if (!admin) {
        return {
          status: 404,
          message: `Admin account does not exist with this ${data.email}`,
        };
      }

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

      const resetToken = await AdminResetPwd.create({
        token: hashToken,
        expirationDate: expireTime,
        AdminId: admin.id,
      });

      const resetURL = `http://127.0.0.1:8080/api/v1/resetPassword/${hashToken}`;

      let message = `Your password reset token is as follows:\n\n\n${resetURL}\n\n\n Click on the link, otherwise copy it into your browser. If you have not requested this email, kindly ignore.`;

      await sendEmail({
        email: admin.email,
        subject: 'Your password reset token expires in 10 mins',
        message,
      });

      return { status: 200, message: 'Reset token sent to email' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Error sending password reset link ' };
    }
  }

  async resetPwd(data) {
    try {
      let getToken = await AdminResetPwd.findOne({
        where: { token: data.token },
      });

      // if Token is wrong
      if (!getToken) {
        return { status: 400, message: 'Invalid token' };
      }

      // If Token has expired
      if (getToken.expirationDate <= Date.now()) {
        console.log(getToken.expirationDate, getToken.token);
        return { status: 404, message: ' Token has expired' };
      }

      let hashPwd = await bcrypt.hash(data.password, 10);

      let admin = await Admin.update(
        { password: hashPwd },
        {
          where: {
            id: getToken.AdminId,
          },
        }
      );
      //// ---- To match this and the one below later On as I advance ON how to use WHERE ------- ////////
      await AdminResetPwd.destroy({
        where: {
          createdAt: {
            [Op.lt]: new Date(new Date() - 10 * 60 * 1000),
          },
        },
      });

      await AdminResetPwd.destroy({
        where: {
          token: getToken.token,
        },
      });

      return { status: 200, message: 'Reset Password was successfully' };
    } catch (err) {
      console.log(err, 'Error @ Reset Pwd');
      return { status: 404, message: 'Error resetting password' };
    }
  }

  async getMe(data) {
    try {
      let findAdmin = await Admin.findOne({
        where: {
          id: data.id,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      return {
        status: 200,
        message: 'Admin found Successfully',
        data: findAdmin,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching Admin' };
    }
  }

  //// ---- To work on this later for address Update ----////
  async updateMe(data) {
    try {
      let updateAdmin = await Admin.update(
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
        message: 'Admin updated Successfully',
        data: updateAdmin,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error Updating Admin' };
    }
  }

  /////------ Admin Route ------//////
  async getOneAdmin(data) {
    try {
      let findAdmin = await Admin.findOne({
        where: {
          id: data.id,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      if (!findAdmin) {
        return {
          status: 404,
          message: `Admin with ID ${data.id} is not found `,
        };
      }

      return {
        status: 200,
        message: 'Admin found Successfully',
        data: findAdmin,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching Admin' };
    }
  }

  async getAllAdmins(data) {
    try {
      let { page } = data;
      let size = 10;

      let admins = await Admin.findAndCountAll({
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        limit: size,
        offset: page * size,
      });

      if (admins.rows < admins.count) {
        return { status: 404, message: `Page ${page} does not exit` };
      }

      return {
        status: 200,
        message: 'Admin found Successfully',
        totalPage: Math.ceil(admins.count / size),
        data: admins,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching all Admin' };
    }
  }

  async updateAdmin(data) {
    try {
      let findAdmin = await Admin.findOne({ where: { id: data.id } });

      if (!findAdmin) {
        return {
          status: 404,
          message: `The Admin with the ID ${data.id} does not not exist `,
        };
      }

      let updateAdmin = await Admin.update(
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
      let findOne = await Admin.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return {
        status: 200,
        message: 'Admin updated Successfully',
        data: findOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error Updating Admin' };
    }
  }

  async deleteAdmin(data) {
    try {
      let admins = await Admin.destroy({
        where: { id: data.id },
      });

      return {
        status: 200,
        message: 'Admin found Successfully',
        data: admins,
      };
    } catch (err) {
      console.log(err);
      return { status: 404, message: ' Error fetching a Admin' };
    }
  }

  ///// to work on this later on ----- /////
  // async restoreAdmin(data) {
  //   console.log(data);
  //   try {
  //     let findAdmin = await Admin.findOne({ where: { email: data.email } });

  //     console.log(findAdmin.id);
  //     if (findAdmin.id) {
  //       let Admins = await Admin.restore(
  //         {
  //           firstName: data.firstName,
  //           lastName: data.lastName,
  //           email: data.email,
  //           password: data.password,
  //         },
  //         { where: { id: Admin.id } }
  //       );

  //       return {
  //         status: 200,
  //         message: 'Admin restored Successfully',
  //         data: Admins,
  //       };
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return { status: 404, message: ' Error restoring Admin' };
  //   }
  // }
}

module.exports = Services;



