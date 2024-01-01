let { ContactUs } = require('./model');

class Services {
  async addMessage(data) {
    try {
      //check if the data is not empty
      if (
        !data.custName ||
        !data.custEmail ||
        !data.custSubject ||
        !data.custMessage
      ) {
        return { status: 404, message: 'All require field must be filled' };
      }

      let custSubject = data.custSubject;
      let custMessage = data.custMessage;

      ///// ----- Validate User Subject for numbers ----- /////
      function validateSubject(custSubject) {
        const regex = /^[0-9A-Za-z\s\.,#-]+$/;
        return regex.test(custSubject);
      }

      ///// ----- To validate if customer Subject  ----- /////
      if (validateSubject(custSubject)) {
        // The input contains only alphabet letters
      } else {
        // The input contains non-alphabet characters
        return {
          status: 404,
          message: 'only alphabet is allowed',
        };
      }

      ///// ----- Validate User Message for numbers ----- /////
      function validateMessage(custMessage) {
        const regex = /^[0-9A-Za-z\s\.,#-]+$/;
        return regex.test(custMessage);
      }

      ///// ----- To validate if customer Message  ----- /////
      if (validateMessage(custMessage)) {
        // The input contains only alphabet letters
      } else {
        // The input contains non-alphabet characters

        return {
          status: 404,
          message: 'Please confirm your message and enter a proper format',
        };
      }

      ///// --- add the ContactUs Message to db ----- /////
      let addMessage = await ContactUs.create({
        custName: data.custName,
        custEmail: data.custEmail,
        custSubject: custSubject,
        custMessage: custMessage,
      });
      return {
        status: 201,
        message: 'Contact-us info posted successfully',
        data: addMessage,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding Contact-us info' };
    }
  }

  async addUserMessage(data) {
    try {
      //check if the data is not empty
      if (
        !data.custName ||
        !data.custEmail ||
        !data.custSubject ||
        !data.custMessage
      ) {
        return { status: 404, message: 'All require field must be filled' };
      }

      let custSubject = data.custSubject;
      let custMessage = data.custMessage;

      ///// ----- Validate User Subject for numbers ----- /////
      function validateSubject(custSubject) {
        const regex = /^[0-9A-Za-z\s\.,#-]+$/;
        return regex.test(custSubject);
      }

      ///// ----- To validate if customer Subject  ----- /////
      if (validateSubject(custSubject)) {
        // The input contains only alphabet letters
      } else {
        // The input contains non-alphabet characters
        return {
          status: 404,
          message: 'only alphabet is allowed',
        };
      }

      ///// ----- Validate User Message for numbers ----- /////
      function validateMessage(custMessage) {
        const regex = /^[0-9A-Za-z\s\.,#-]+$/;
        return regex.test(custMessage);
      }

      ///// ----- To validate if customer Message  ----- /////
      if (validateMessage(custMessage)) {
        // The input contains only alphabet letters
      } else {
        // The input contains non-alphabet characters

        return {
          status: 404,
          message: 'Please confirm your message and enter a proper format',
        };
      }

      ///// --- add the ContactUs Message to db ----- /////
      let addMessage = await ContactUs.create({
        custName: data.custName,
        custEmail: data.custEmail,
        custSubject: custSubject,
        custMessage: custMessage,
        UserId: data.id,
      });

      return {
        status: 201,
        message: 'Contact-us info posted successfully',
        data: addMessage,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error adding Contact-us info' };
    }
  }

  async getMessage(data) {
    console.log(data);
    try {
      let getOne = await ContactUs.findOne({
        where: { id: data.id },
      });

      if (!getOne) {
        return { status: 404, message: 'ContactUs with this ID is not found' };
      }

      // if the contactus was successfull return success response
      return {
        status: 200,
        message: 'ContactUs found successfully',
        data: getOne,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error retrieving payment status' };
    }
  }

  async getAllMessages(data) {
    try {
      let { page } = data;
      let size = 10;
      let getMessage = await ContactUs.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });
      return {
        status: 200,
        message: 'All ContactUs record retrieve successfully',
        getMessage,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error getting All ContactUS records' };
    }
  }

  async deleteMessage(data) {
    try {
      let getMessage = await ContactUs.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getMessage) {
        return { status: 404, message: 'ContactUs with this ID is not found' };
      }

      let deleteRec = await ContactUs.destroy({ where: { id: data.id } });
      return {
        status: 204,
        message: 'ContactUs record deleted successfully',
        getMessage,
      };
    } catch (err) {
      console.log(err);
      return { status: 204, message: 'Error  deleting ContactUs' };
    }
  }
}

module.exports = Services;
