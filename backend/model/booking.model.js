module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("booking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicles', 
        key: 'id',
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
  };

  return Booking;
};
