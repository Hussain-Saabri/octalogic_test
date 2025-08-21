const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import user model

db.vehicleType = require("./vehicleType.model.js")(sequelize, DataTypes);
db.vehicle = require("./vehicle.model.js")(sequelize, DataTypes);
db.booking = require("./booking.model.js")(sequelize, DataTypes);

module.exports = db;
