const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');
// const { toDefaultValue } = require('sequelize/types/utils');

const Category = sequelize.define('category', {
  
    

      name: {
        type: DataTypes.STRING,
        autoIncrement: false,
        
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false

  }

},


);

   
 




module.exports= Category;