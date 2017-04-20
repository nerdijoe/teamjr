'use strict';
module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define('Menu', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Menu.belongsToMany(models.Order, { through: 'Details', foreignKey: 'id_menu'});
      }
    }
  });
  return Menu;
};
