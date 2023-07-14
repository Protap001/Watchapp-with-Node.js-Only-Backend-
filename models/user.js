const sequelize = require("../data/db");
const {DataTypes} = require("sequelize");
const bcrypt = require('bcrypt');

const User = sequelize.define('user',{
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty : {
                msg: "Ad ve Soyad daxil edin"
            },
            isFullname(value){
                if(value.split(" ").length < 2){
                    throw new Error("Ad ve Soyad melumatlarinizi girin");
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Email daha once istifade olunub"
        },
        validate: {
            notEmpty : {
                msg: "Email daxil edin"
            },
            isEmail: {
                msg: "Email formatinda olmalidir"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "parolu daxil edin"
            },
            len: {
                args: [8, 15],
                msg: "Parol uzunlugu 8-15 araliginda olmalidir"
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {timestamps: true}
);

User.afterValidate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
})

module.exports = User;