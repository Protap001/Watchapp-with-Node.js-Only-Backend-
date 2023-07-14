const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');
// const { toDefaultValue } = require('sequelize/types/utils');

const Role = sequelize.define('role', {
  
    

      rolename: {
        type: DataTypes.STRING,
        autoIncrement: false,
        
    }
},


);

   
 




module.exports= Role;