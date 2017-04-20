'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    id_user: DataTypes.INTEGER,
    is_checkout: DataTypes.BOOLEAN,
    total: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Order.belongsTo(models.User, { foreignKey: 'id_user'})
        
        Order.belongsToMany(models.Menu, { through: 'Details', foreignKey: 'id_order'});
      }
    }
  });
  return Order;
};
