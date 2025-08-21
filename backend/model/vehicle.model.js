// vehicle.js
module.exports = (sequelize, DataTypes) => {
  const vehicle = sequelize.define("vehicle", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicleTypes",
        key: "id"
      }
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  vehicle.associate = (models) => {
   vehicle.belongsTo(models.vehicleType, { foreignKey: "type_id", as: "vehicleType" });
  };

  return vehicle;
};
