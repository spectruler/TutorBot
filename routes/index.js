const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user')

router.get("/register",function(req,res){
    res.render('register')
})

router.post("/register",function(req,res){
    User.register(new User({firstname:req.body.firstname, lastname: req.body.lastname, username: req.body.username,status:req.body.status})
    ,req.body.password,function(err,user){
        console.log(req.body.firstname, req.body.lastname, req.body.email,req.body.status)
        if(err){
            console.log(err)
            req.flash("error",err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to online tutor bot",+user.firstname+" "+user.lastname)
            if (req.body.status == 'student'){
                res.redirect("/")
            }else{
                res.redirect("/tutor/info",{user:user})
            }
        })
    })
})



router.get("/signin",function(req,res){
    res.render('login')
})

router.post("/signin",passport.authenticate("local",{
    successRedirect: "/tutor/info",
    failure: "/signin"
}),function(req,res){


})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/register')
})

module.exports = router;