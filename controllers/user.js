const Watch = require("../models/watch");
const Category = require("../models/category");
const {Op} = require ('sequelize');
const { default: slugify } = require("slugify");
const { request } = require("express");




 exports.watches_details = async (req, res) => {
        const slug = req.params.slug;  
        try{
            const watch= await Watch.findOne({
                where: {
                    url: slug
                },
    
                raw: true
            })
            // const watch = watches[0];
    
            if(watch){
            return res.render('users/watch-details', {
                title: watch.basliq,
                watch: watch
                
            }) ;
            }
            res.redirect('/');
          
            
        }
    catch(err){
        console.log(err);
    }
    
    }


exports.wacth_list = async (req, res) => {
    const size = 3;
    const {page = 0} = req.query;
    const slug = req.params.slug;
    

        try{
            const {rows, count} = await Watch.findAndCountAll({
                where: {testiq: { [Op.eq]: true }},
                raw: true,
                include: slug ? {model: Category, where: {url: slug}} : null,
                limit: size,
                offset: page*size
            });

            {rows, count}
            
            const categories = await Category.findAll({raw: true});
            res.render('./users/watches', {
                title: 'Butun saatlar',
                watches: rows,
                totalItems: count,
                totalPages: Math.ceil(count / size),
                currentPage: page,
                categories: categories,
                selectCategory: slug
            });
            console.log(watches);
        }
        
        catch(err){
        console.log(err);
        }
        
            
        }




 exports.index = async (req, res) => {
    console.log(req.cookies);

            try{
        
                const watches = await Watch.findAll({
                    where: {
                        [Op.and]: [
                            {anasehife: true},
                            {testiq: true}
                        ]
                    }, 
                    raw: true
                });
                const categories = await Category.findAll({ raw: true });
            
                console.log(watches);
                console.log(categories);
                
                res.render('users/index', {
                    title: 'Populyar saatlar',
                    watches: watches,
                    categories: categories,
                    selectCategory: null
                })
                
            }
            
            catch(err){
            console.log(err);
            }
        
        
          
        }