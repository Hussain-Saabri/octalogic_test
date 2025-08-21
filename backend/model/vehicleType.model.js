module.exports = (sequelize, DataTypes) => {
  const vehicleType = sequelize.define("vehicleType", {
    id: 
    { type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true },
    name: 
    { type: DataTypes.STRING,
      allowNull: false,
      unique: true, },
    wheels: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[2, 4]], 
      }
    
    
    }
    
   
  });
  vehicleType.associate = (models) => {
    vehicleType.hasMany(models.vehicle, { foreignKey: "type_id", as: "vehicles" });
  };
  return vehicleType ;
};











