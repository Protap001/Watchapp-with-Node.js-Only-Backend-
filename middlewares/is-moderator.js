module.exports = (req, res, next) => {
    if(!req.session.isAuth){

        return res.redirect("/account/login?returnUrl=" + req.originalUrl); // => /admin/watches
    }

    if(!req.session.roles.includes("admin") && !req.session.roles.includes("moderator") ){
        req.session.message = {text: "Uygun bir istifadeci ile giris edin"};
        return res.redirect("/account/login?returnUrl=" + req.originalUrl);
    }

    next();
} 