const User = require("../models/user");
const bcrypt = require('bcrypt');
const emailService = require('../helpers/send-mail');
const config = require("../config");
const crypto = require("crypto");
const {Op} = require("sequelize");

exports.get_register = async (req, res) => {
    try {
        return res.render('auth/register', {
            title: 'register'
        })
    }

    catch(err) {
        res.redirect("/500");
    }
}



exports.post_register = async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
 try{
        // throw new Error("Xeta bas verdi");
       const newUser =  await User.create({
            fullname: name,
            email: email,
            password: password
        });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: 'Hesab yaradildi',
            text: 'Hesabiniz ugurlu sekilde yaradildi'

        });

        req.session.message = { text: "Hesabiniza giris ede bilersiniz", class: "success"};

        return res.redirect ("login");
    }
        catch(err) { 
            let msg = "";
            if(err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError"){
            for(let e of err.errors){
                msg += e.message + ""
            }

            return res.render('auth/register', {
                title: 'register',
                message: {text: msg, class: "danger"}
            });
           
            } else{
                res.redirect("/500");
            }
            
            
        }
}



exports.get_login = async (req, res) => {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render('auth/login', {
            title: 'login',
            message: message,
            csrfToken: req.csrfToken()    
        })
    }

    catch(err) {
        console.log(err)
    }
}





exports.post_login = async (req, res) => {  

    const email = req.body.email;
    const password = req.body.password;

    try {
         const  user = await  User.findOne({
    where: {
            email: email
    }
});


if(!user){
    return res.render('auth/login', {
        title: 'login',
        message:  { text: "email yanlisdir", class: "danger"}
    });
}


    const match = await bcrypt.compare(password, user.password);

    if(match){
        const userRoles = await user.getRoles({
            attributes: ["rolename"],
            raw: true
        });

         req.session.roles = userRoles.map((role) => role["rolename"]); //
         req.session.isAuth = true;
         req.session.fullname = user.fullname;
         req.session.userid = user.id;


    const url = req.query.returnUrl ||  "/";
       return res.redirect(url)
    }
     

            return res.render('auth/login', {
            title: 'login',
            message: { text: "parol yanlisdir", class: "danger"}
        });
       
    }

    catch(err) {
        console.log(err)
    }
}



exports.get_logout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/account/login");
    }

    catch(err) {
        console.log(err)
    }
}


exports.get_reset = async (req, res) => {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render('auth/reset-password', {
            title: 'reset-password',
            message: message
        })
    }

    catch(err) {
        console.log(err)
    }
}


exports.post_reset = async (req, res) => {
    const email = req.body.email;
    try {
        var token = crypto.randomBytes(32).toString("hex");
        const user = await User.findOne({where: {email: email}});
        if(!user){
            req.session.message = { text:'Bu email adresi tapilmadi', class: "danger"};
            return res.redirect("reset-password");
 }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
    await user.save();


    emailService.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Reset Password',
        html: `
        <p>Sifrenizi yenilenek ucun asagidaki linke daxil olun</p>
        <p>
        <a href="http://localhost:3000/account/new-password/${token}"> Sifreni sifirla </a>
        </p>
        `

    });

    req.session.message = {text: "Sifrenizi sifirlamaq icin email adresinizi yoxlayin", class: "success"};
    res.redirect("login");

 
        
    }

    catch(err) {
        console.log(err)
    }
}



exports.get_newpassword = async (req, res) => {
    const token = req.params.token;
    
    try {
        const user = await User.findOne({
            where : {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt] : Date.now()
                }
            }
        })
        return res.render('auth/new-password', {
            title: 'new password',
           token: token,
           userId: user.id
        })
    }

    catch(err) {
        console.log(err)
    }
}



exports.post_newpassword = async (req, res) => {
    const token = req.body.token;
    const userId = req.body.userId;
    const newPassword = req.body.password;
    try {
        const user = await User.findOne({
            where : {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt] : Date.now()
                },
                id: userId
            }
        } );

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();

        req.session.message = {text: "Sifreniz yenilendi", class: "success"};
        return res.redirect("login");
    }

    catch(err) {
        console.log(err);
    }
}
