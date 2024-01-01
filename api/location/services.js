const { Location, sequelize } = require('./model');
const { QueryTypes } = require('sequelize');

class Services {
  async addLocation(data) {
    try {
      //Check if the data filled are correct
      if (!data.state || !data.lga || !data.shipping) {
        return { status: 404, message: 'All field must filled' };
      }

      //if location already exist
      let getOne = await Location.findOne({ where: { lga: data.lga } });

      //if location exist reject
      if (getOne) {
        return { status: 400, message: 'This Location already exist ' };
      } else {
        //if location does not exist add a new location
        let addArea = await Location.create({
          state: data.state,
          lga: data.lga,
          shipping: data.shipping,
        });

        //send response back to the users
        return { status: 201, message: 'Location added successfully', addArea };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error finding Location', addArea };
    }
  }

  async getLocation(data) {
    try {
      // If product exist
      let getOne = await Location.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!getOne) {
        return {
          status: 404,
          message: `Location with ID ${data.id} not found`,
        };
      }

      return { status: 200, message: 'Location found successfully', getOne };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'An Error occurred, Location with ID not found',
      };
    }
  }

  async getAllLocation(data) {
    console.log(data);
    try {
      let { page } = data;
      let size = 10;

      let Locations = await Location.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: size,
        offset: page * size,
      });

      if (Locations.rows < Locations.count) {
        return { status: 404, message: `Page ${page} does not exit` };
      }

      return {
        status: 200,
        message: 'All Location found successfully',
        totalPage: Math.ceil(Locations.count / size),
        data: Locations,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'An Error, while getting all Locations' };
    }
  }

  async updateLocation(data) {
    try {
      //if Location exist
      let findOne = await Location.findOne({ where: { id: data.id } });

      //if Location does not exist return a respond to users
      if (!findOne) {
        return { status: 404, message: 'Location with does not exist ' };
      }
      //if Location exist return update it details
      let update = await Location.update(
        {
          state: data.state,
          lga: data.lga,
          shipping: data.shipping,
        },
        {
          where: { id: data.id },
        }
      );

      let getOne = await Location.findOne({
        where: { id: data.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      //return responses back to the users
      return { status: 200, message: 'Location updated successfully', getOne };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Error occurred while updating Location' };
    }
  }

  async deleteLocation(data) {
    console.log(data);
    try {
      let findOne = await Location.destroy({ where: { id: data.id } });

      if (!findOne) {
        return { status: 404, message: 'Location with ID does not exist' };
      }
      return { status: 204, message: 'Location deleted successfully' };
    } catch (err) {
      console.log(err);
      return {
        status: 200,
        message: 'An Error occurred while trying to delete Location',
      };
    }
  }

  async pickState() {
    try {
      ///// ----- Check if order exist inside the database ----- /////
      ///// ----- get All Location State ----- /////
      const getAllLocation = `SELECT DISTINCT state FROM "Location_Tables" ORDER BY state`;

      let getAll = await sequelize.query(getAllLocation, {
        type: QueryTypes.SELECT,
      });

      return { status: 200, message: 'Locations found successfully', getAll };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: ' Error occurred while getting Location',
      };
    }
  }

  async pickLGA(data) {
    try {
      ///// ----- Check if order exist inside the database ----- /////
      ///// ----- get All Location State ----- /////
      const getAllLocation = `SELECT id, lga FROM "Location_Tables" WHERE state = ? ORDER BY lga`;

      let getAll = await sequelize.query(getAllLocation, {
        replacements: [data.id],
        type: QueryTypes.SELECT,
      });

      return { status: 200, message: 'Locations found successfully', getAll };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: ' Error occurred while getting Location',
      };
    }
  }
}

module.exports = Services;
