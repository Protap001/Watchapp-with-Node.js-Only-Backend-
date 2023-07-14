const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');
// const { toDefaultValue } = require('sequelize/types/utils');

const Watch = sequelize.define('watch', {
   
    basliq:{
        type: DataTypes.STRING,
        allowNull: false

    },

    url:{
        type: DataTypes.STRING,
        allowNull: false

    },

    altbasliq: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aciqlama: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sekil: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anasehife: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    testiq: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
   
   
}, 
   { timestamps: true,
    validate: {
        checkValidTestiq() {
           if(this.anasehife && !this.testiq) {
            throw new Error("Anasehifeye elave etdiyiniz saat testiqlenmedi");
           }
        }
    }
        
}
);




module.exports= Watch;