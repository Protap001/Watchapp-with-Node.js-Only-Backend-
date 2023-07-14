const Watch = require('../models/watch');
const Category = require('../models/category');
const fs = require('fs');
const { request } = require('http');
const {Op} = require ('sequelize');
const sequelize = require('../data/db');
const slugField = require("../helpers/slugfield");
const Role = require('../models/role');
const User = require('../models/user');

exports.get_watch_delete = async function(req, res){
    const watchid = req.params.watchid;
    const userid = req.session.userid;

    const isAdmin = req.session.roles.includes("admin")

    try {
        const watch = await Watch.findOne({
          where: isAdmin ? {id:watchid} : {id: watchid, userId: userid}});
        if(watch){
          return  res.render("admin/watch-delete", {
            title: "delete watch",
            watch: watch
        });
        }
        
        res.redirect('/admin/watches');

        
    }
    catch(err) {
        console.log(err);
    }
}



exports.post_watch_delete = async function(req, res) {
    const watchid = req.body.watchid;
    try {
        const watch = await Watch.findByPk(watchid);
        
        if(watch){
            await watch.destroy();
          return  res.redirect("/admin/watches?action=delete");
        }
            res.redirect('/admin/watches')
        
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_category_delete = async function(req, res){
    const categoryid = req.params.categoryid;

    try {
        const category = await Category.findByPk(categoryid);

        if(category){
          return  res.render("admin/category-delete", {
            title: "delete category",
            category: category
        });
        }

        res.redirect('/admin/categories')
        

        
    }
    catch(err) {
        console.log(err);
    }
}


exports.post_category_delete = async function(req, res) {
    const categoryid = req.body.categoryid;
    try {
        await Category.destroy({
            where: {
                id: categoryid

            }
        });
        res.redirect("/admin/categories?action=delete");
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_watch_create = async function(req, res) {
    try {
      

        const categories = await Category.findAll();

        res.render("admin/watch-create", {
            title: "add watch",
            categories: categories
        });
    }
    catch(err) {
        console.log(err);
    }
}


exports.post_watch_create = async function(req, res) {
    const basliq = req.body.basliq;
    const altbasliq = req.body.altbasliq;
    const aciqlama = req.body.aciqlama;
    const anasehife = req.body.anasehife == "on" ? 1:0;
    const testiq = req.body.testiq == "on"? 1:0;
    const userid = req.session.userid;
    let sekil = ""
    

    try {

        if(basliq == "") {
            throw new Error("Basligi bos saxlamaq olmaz");
        }

        if(basliq.length < 5 || basliq.length > 20) {
            throw new Error("Basliq 5-20 herf araliginda olmalidir")
        }

        if(aciqlama == "") {
            throw new Error("aciqlamani bos saxlamaq olmaz");
        }

        if(req.file){
            sekil = req.file.filename

            fs.unlink("./public/images" + req.body.sekil, err => {
                console.log(err);
            })
        }

        await Watch.create({
            basliq: basliq,
            url: slugField(basliq),
            altbasliq: altbasliq,
            aciqlama: aciqlama,
            sekil: sekil,
            anasehife: anasehife,
            testiq: testiq,
            userId: userid
            


        });
        
        res.redirect("/admin/watches?action=create");
    }
    catch(err) {
        let sehvmesaj = "";
        if (err instanceof Error) {
            sehvmesaj += err.message;

            res.render("admin/watch-create", {
                title: "add watch",
                categories: await Category.findAll(),
                message: {text: sehvmesaj, class: "danger"},
                values: {
                    basliq: basliq,
                    altbasliq: altbasliq,
                    aciqlama: aciqlama
                }
            });

        }
    }
}


exports.get_category_create = async function(req, res) {
    try {
        res.render("admin/category-create", {
            title: "add category"
        });
    }
    catch(err) {
        res.redirect("/500");
    }
}

exports.post_category_create = async function(req, res) {
    const name = req.body.name;
    try {
        await Category.create({name: name});
        res.redirect("/admin/categories?action=create");
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_watch_edit = async function(req, res) {
    const watchid = req.params.watchid;
    const userid = req.session.userid;

    const isAdmin = req.session.roles.includes("admin")

    try {
        const watch = await Watch.findOne({
            where : isAdmin ? {id: watchid} : {id: watchid, userId: userid },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        const categories = await Category.findAll();

        if(watch) {
            return res.render("admin/watch-edit", {
                title: watch.dataValues.basliq,
                watch: watch.dataValues,
                categories: categories
            });
        }

        res.redirect("/admin/watches");
    }
    catch(err) {
        console.log(err);
    }
}


exports.post_watch_edit = async function(req, res) {
    const watchid = req.body.watchid;
    const basliq = req.body.basliq;
    const altbasliq = req.body.altbasliq;
    const aciqlama = req.body.aciqlama;
   const kateqoriyaIds = req.body.categories;
    const url = req.body.url;
    const userid = req.session.userid;

    
    let sekil = req.body.sekil;

if(req.file) {
    sekil = req.file.filename;

   fs.unlink("./public/images/" + req.body.sekil, err => {
    console.log(err);
   })
}

    const anasehife = req.body.anasehife == "on" ? 1 : 0;
    const testiq = req.body.testiq == "on" ? 1 : 0;
    const isAdmin = req.session.roles.includes("admin")
    
    try {
        const watch = await Watch.findOne({
            where : isAdmin ? {id: watchid} : {id: watchid, userId: userid },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });

            
        if(watch){
            watch.basliq = basliq;
            watch.altbasliq = altbasliq;
            watch.aciqlama = aciqlama;
            watch.sekil = sekil;
            watch.anasehife = anasehife;
            watch.testiq = testiq;
            watch.url = url;
           

            if(kateqoriyaIds == undefined) {
                await watch.removeCategories(watch.categories);
            } else {
                await watch.removeCategories(watch.categories);
                const selectedCategories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: kateqoriyaIds
                        }
                    }
                });

                await watch.addCategories(selectedCategories);
            }

            await watch.save();
            return res.redirect("/admin/watches?action=edit&watchid=" + watchid);
        }
        res.redirect("/admin/watches");
        // await db.execute("UPDATE watch SET basliq=?, altbasliq=?, aciqlama=?, sekil=?, anasehife=?, testiq=?, categoryid=? WHERE watchid=?", [basliq, altbasliq, aciqlama, sekil, anasehife,testiq,kateqoriyaid, watchid]);
       
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_category_remove = async (req, res) =>{
        const watchid = req.body.watchid;
        const categoryid = req.body.categoryid;


        await sequelize.query(`delete from watchCategories where watchId=${watchid} and categoryId=${categoryid}`);
        res.redirect("/admin/categories");
}

exports.get_category_edit = async function(req, res) {
    const categoryid = req.params.categoryid;

    try {

        const category = await Category.findByPk(categoryid); 
        const watches = await category.getWatches();
        const countWatch = await category.countWatches();
           
        

        if(category) {
            return res.render("admin/category-edit", {
                title: category.dataValues.name,
                category: category.dataValues,
                watches: watches,
                countWatch: countWatch
            });
        }

        res.redirect("admin/categories");
    }
    catch(err) {
        console.log(err);
    }
}


exports.post_category_edit = async function(req, res) {
    const categoryid = req.body.categoryid;
    const name = req.body.name;


    try {

        await Category.update({name: name},{
            where: {
                id:  categoryid
            }
        });
            return  res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);    
        }
            catch(err) {
            console.log(err);
         }
}

exports.get_watches = async function(req, res) {
    const userid = req.session.userid;
    const isModerator = req.session.roles.includes("moderator");
    const isAdmin = req.session.roles.includes("admin");
   
    try {
       
            const watches = await Watch.findAll({
        attributes: ['id', 'basliq', 'altbasliq', 'sekil'],
        include: {
            model: Category,
            attributes: ["name"]
        },

        where: isModerator && !isAdmin ? {userId : userid} : null
    
    });

         res.render("admin/watch-list", {
            title: "watch list",
            watches: watches,
            action: req.query.action,
            watchid: req.query.watchid
        });

        
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_categories = async function(req, res) {
    try {
        const categories = await Category.findAll();
        res.render("admin/category-list", {
            title: "watch list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    }
    catch(err) {
        console.log(err);
    }
}



exports.get_roles = async function(req, res) {
    try {
        const roles = await Role.findAll({
            attributes: {
                include: ['role.id', 'role.rolename', [sequelize.fn('COUNT', sequelize.col('users.id',)), 'user_count']]
            },

            include: [
                {model: User, attributes:['id']}
            ],
            group: ['role.id'],
            raw: true,
            includeIgnoreAttributes: false
        })
        res.render("admin/role-list", {
            title: "role list",
            roles: roles
        });
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_role_edit = async function(req, res) {
   const roleid = req.params.roleid;
    try {
       const role = await Role.findByPk(roleid);
       const users = await role.getUsers();
       if(role){
        return res.render("admin/role-edit", {
            title: role.rolename,
            role: role,
            users: users
        })
       }

       res.redirect("admin/roles");
    }
    catch(err) {
        console.log(err);
    }
}


exports.post_role_edit = async function(req, res) {
    const roleid = req.body.roleid;
    const rolename = req.body.rolename;

    try {
       await Role.update({rolename: rolename},{
        where: {
            id: roleid
        }
       });
       return res.redirect("/admin/roles");
    }
    catch(err) {
        console.log(err);
    }
}


exports.roles_remove = async function(req, res) {
    const roleid = req.body.roleid;
    const userid = req.body.userid

    try {
       await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`);
       return res.redirect("/admin/roles/" + roleid);
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_user = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "fullname", "email"],
            include: {
                model: Role,
                attributes: ["rolename"]
            }
        });

        res.render("admin/user-list", {
            title: "user list",
            users: users
        })
     }
     catch(err) {
         console.log(err);
     }
}


exports.get_user_edit = async (req, res) => {
    const userid = req.params.userid;
    try {
       const user = await User.findOne({
        where: {
            id: userid
        },
        include: {model: Role, attributes: ["id"]}
       });

       const roles = await Role.findAll();

        res.render("admin/user-edit", {
            title: "user edit",
           user: user,
           roles: roles
        });
     }
     catch(err) {
         console.log(err);
     }
}


exports.post_user_edit = async (req, res) => {
    const userid = req.params.userid;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const roleIds = req.body.roles;

    

    try {
        const user = await User.findOne({
            where: {
                id: userid
            },
            include: {model: Role, attributes: ["id"]}
           });

           if(user){
            user.fullname = fullname;
            user.email = email;

            if(roleIds == undefined){
                await user.removeRoles(user.roles);
            } else {
                await user.removeRoles(user.roles);
                const selectedRoles = await Role.findAll({
                    where: {
                        id: {
                            [Op.in] :  roleIds
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }

            await user.save();
            return res.redirect("/admin/users");

           }
          return res.redirect("/admin/users");
     }
     catch(err) {
         console.log(err);
     }
}


