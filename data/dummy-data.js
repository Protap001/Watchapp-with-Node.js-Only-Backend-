const Category = require('../models/category');
const Watch = require('../models/watch');
const slugField = require("../helpers/slugfield");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Role = require('../models/role');




async function populate() {
     const count = await Category.count();

    if(count == 0){

        const users = await User.bulkCreate([
            {fullname: "Tapdiq abi", email: 'yoxxdu@mail.ru' , password: await bcrypt.hash('123321456', 10)},
            {fullname: "Nurlan abi", email: 'var@mail.ru' , password: await bcrypt.hash('123321456', 10)},
            {fullname: "Nail abi", email: 'nail@mail.ru' , password: await bcrypt.hash('123321456', 10)},
            {fullname: "Nurlan dosan", email: 'nurlan@mail.ru' , password: await bcrypt.hash('123321456', 10)},
            {fullname: "Nail suck", email: 'suck@mail.ru' , password: await bcrypt.hash('123321456', 10)},

        ]);

        const roles = await Role.bulkCreate([
            {rolename: "admin"},
            {rolename: "moderator"},
            {rolename: "guest"}
        ]);


        await users[0].addRole(roles[0]); // admin => Tapdiq abi
        await users[1].addRole(roles[1]); // moderator => Nurlan abi
        await users[2].addRole(roles[1]); // moderator => Nail abi
        
        await users[3].addRole(roles[2]); // guest => Nurlan dosan
        await users[4].addRole(roles[2]); // guest => Nail suck

         
      const categories =  await Category.bulkCreate([
            {name: 'Brend saatlar', url: slugField('Brend saatlar')},
            {name: 'Bahali saatlar',url: slugField('Bahali saatlar')},
            {name: 'Smart saatlar', url: slugField('Smart saatlar')}
        ]);


      const watches =  await Watch.bulkCreate([
            {
                basliq: 'Rolex',
                url: slugField('Rolex'),
                altbasliq: 'Rolex, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Rolex, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '1.png',
                anasehife: true,
                testiq: true,
                userId: 2
                
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 2
            
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 2
            
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
            },
            {
                basliq: 'Omega',
                url: slugField('Omega'),
                altbasliq: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi.',
                aciqlama: 'Omega, dünya üzrə tanınan bir İsveçrə saat brendi ve gozel gozel gozel',
                sekil: '3.png',
                anasehife: true,
                testiq: true,
                userId: 3
              
            },
        ]);


       


       await categories[0].addWatch(watches[0]);
       await categories[0].addWatch(watches[1]);

       await categories[0].addWatch(watches[2]);
       await categories[0].addWatch(watches[3]);

       await categories[0].addWatch(watches[4]);
       await categories[0].addWatch(watches[5]);

       await categories[0].addWatch(watches[6]);
       await categories[0].addWatch(watches[7]);

       await categories[1].addWatch(watches[8]);
       await categories[1].addWatch(watches[9]);

       await categories[0].addWatch(watches[10]);
       

       await categories[1].addWatch(watches[2]);
       await categories[1].addWatch(watches[3]);

       await categories[2].addWatch(watches[2]);
       await categories[2].addWatch(watches[3]);

      
       await watches[0].addCategory(categories[1]);
    
    }
   
   };





   module.exports = populate;