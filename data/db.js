const config = require('../config');


const Sequelize= require('sequelize');

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: 'mysql',
    host: config.db.host,
    define: {
        timestamps: false
    },

    storage: "./sesion.mysql"

});


module.exports = sequelize;

async function connect(){
    try{
    await sequelize.authenticate();
    console.log('mysql baglandi ');
}

catch(err){
    console.log("baglantida xeta", err)
}
};

connect();




//  let connection = mysql.createConnection(config.db);
    


//  connection.connect((err) => {
//     if(err){
//         console.log(err);

//     }



//     console.log('Mysql server baglandi');
//  });


//  module.exports= connection.promise();