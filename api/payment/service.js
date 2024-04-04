let { Payment, Order } = require('./model');
let axios = require('axios');

class Services {
  async addPayment(data) {
    try {
      //check if the data is not empty
      if (
        !data.PaymentId ||
        !paystackURL ||
        !data.OrderTableId ||
        !data.amount ||
        !data.UserId
      ) {
        return { status: 400, message: 'All require field must be filled' };
      }

      let getOne = await Payment.findOne({
        where: { PaymentId: data.PaymentId },
      });

      if (getOne) {
        return { status: 404, message: 'payment already exist' };
      } else {
        //add the payment info to db
        let add = await Payment.create({
          PaymentId: data.PaymentId,
          paystackURL: data.paystackURL,
          OrderTableId: data.OrderTableId,
          amount: data.amount,
          UserId: data.UserId,
        });

        return {
          status: 201,
          message: 'Payment info posted successfully',
          data: add,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding Payment info' };
    }
  }

  async getPaymentStatus(data) {
    console.log(data);
    try {
      let getOne = await Payment.findOne({
        where: { id: data.id },
      });

      let payId = getOne.PaymentId;

      if (!getOne) {
        return { status: 404, message: 'Payment with the ID not found' };
      }

      //Check the paymentId on paystack to confirm the status
      const config = {
        baseURL: `${process.env.BASE_URL}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      const response = await axios.get(`/transaction/verify/${payId}`, config);

      // if the payment was successfull return success response
      return {
        status: 200,
        message: 'Payment status retrieved',
        data: response.data,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error retrieving payment status' };
    }
  }

  //// ----- This route is new ----- /////
  async getUsersPayment(data) {
    try {
      let getpayment = await Payment.findOne({
        where: { UserId: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getpayment) {
        return { status: 404, message: 'Payment with ID not found' };
      }
      return {
        status: 200,
        message: 'All payment record retrieve successfully',
        getpayment,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error getting All Payment records' };
    }
  }

  //// ----- This route is new ----- /////
  async getOnePayment(data) {
    try {
      let getpayment = await Payment.findOne({
        where: { OrderTableId: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getpayment) {
        return { status: 404, message: 'Payment with ID not found' };
      }
      return {
        status: 200,
        message: 'All payment record retrieve successfully',
        getpayment,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error getting payment record' };
    }
  }

  async getAllPayment(data) {
    try {
      let { page } = data;
      let size = 10;

      let getpayment = await Payment.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      return {
        status: 200,
        message: 'All payment record retrieve successfully',
        getpayment,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error getting All Payment records' };
    }
  }

  async updatePayment(data) {
    try {
      let getOne = await Payment.findOne({
        where: { id: data.id },
      });

      if (!getOne) {
        return { status: 404, message: 'Order with ID not found' };
      }
      //// get the product
      let prodId = getOne.OrderTableId;

      let getProd = await Order.findOne({
        where: { id: prodId },
      });

      //// Update the status
      let updateRec = await Order.update(
        { paymentStatus: data.paymentStatus },
        { where: { id: getProd.id } }
      );

      let updated = await Order.findOne({
        where: { id: getProd.id },
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

  async getSuccessStatus(data) {
    try {
      let { page } = data;
      let size = 10;

      let payment = await Order.findAndCountAll({
        where: { paymentStatus: 'success' },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (payment.rows < payment.count) {
        return { status: 404, message: `Page ${page} does not exit` };
      }

      return {
        status: 200,
        message: 'All Successful payment was found successful',
        totalPage: Math.ceil(payment.count / size),
        data: payment,
      };
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  async getFailedStatus(data) {
    try {
      let { page } = data;
      let size = 10;

      let payment = await Order.findAndCountAll({
        where: { paymentStatus: 'failed' },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (payment.rows < payment.count) {
        return { status: 404, message: `Page ${page} does not exit` };
      }

      return {
        status: 200,
        message: 'All failed was found successful',
        totalPage: Math.ceil(payment.count / size),
        data: payment,
      };
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  async getAllRevenue() {
    try {
      let revenue = await Order.sum('grandTotal', {
        where: { paymentStatus: 'success' },
      });

      return {
        status: 200,
        message: 'All Successful payment was found successful',

        data: revenue,
      };
    } catch (error) {
      console.log(error);
      return { status: 404, message: 'Error getting one Order ' };
    }
  }

  async deletePayment(data) {
    try {
      let getpayment = await Payment.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getpayment) {
        return { status: 404, message: 'Payment with ID not found' };
      }

      let deleteRec = await Payment.destroy({ where: { id: data.id } });

      return {
        status: 204,
        message: 'Payment record deleted successfully',
        getpayment,
      };
    } catch (err) {
      console.log(err);
      return { status: 204, message: 'Payment was deleted successfully' };
    }
  }
}

module.exports = Services;
