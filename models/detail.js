'use strict';
module.exports = function(sequelize, DataTypes) {
  var Detail = sequelize.define('Detail', {
    id_order: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    notes: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Detail;
};