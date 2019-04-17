const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user'),
      async = require('async'),
      _ = require('lodash'),
      Tutor = require('../models/tutor'),
      Field = require('../models/field')



router.get('/',function(req,res){

    async.parallel([
        function(callback){
            Tutor.find({},(err,tutor)=>{
                    callback(err,tutor)
            })
        }
    ],(err,tutor)=>{
        if(err){
            console.log(err)
        }
        const tut = tutor[0]

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < tut.length;i += chunkSize){
            if(tut.length < chunkSize){
            dataChunk.push(tut.slice((i,tutor.length-1)))
            }else
            dataChunk.push(tut.slice((i,i+chunkSize)))
        }
        console.log(dataChunk)
        Field.find({},(err,field)=>{
            if(err){
                console.log(err)
                req.flash('error',err)
            }else{
                res.render('index',{title:'Online Tutor Bot - Home',data:dataChunk,fields:field})                
            }
        })
    })
})

router.get("/register",function(req,res){
    res.render('register')
})

router.post("/register",function(req,res){
    User.register(new User({firstname:req.body.firstname, lastname: req.body.lastname, username: req.body.username,status:req.body.status})
    ,req.body.password,function(err,user){
        console.log(req.body.firstname, req.body.lastname, req.body.username,req.body.status,req.body.password)
        if(err){
            console.log(err)
            req.flash("error",err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to online tutor bot"+ user.firstname +" "+ user.lastname)
            if (req.body.status == 'student'){
                res.redirect("/")
            }else{
                res.redirect("/tutor/info")
            }
        })
    })
})



router.get("/signin",function(req,res){
    res.render('login')
})

router.post("/signin",passport.authenticate("local",{
    failure: "/signin"
}),function(req,res){
    if(req.user.status == 'student'){
        res.redirect('/')

    }
    if (req.user.status == 'tutor'){
        Tutor.findOne({'email':req.user.username},(err,tutor)=>{
            if(err){
                console.log(err)
            }else{
                if(tutor == null){
                    res.redirect('/tutor/info')
                }else{
                    //tutor info exist check for subjects
                    if (tutor.subjects.length >= 1){
                        res.redirect('/')
                    }else{
                        res.redirect('/tutor/add/subject')
                    }
                    console.log(tutor.subjects)
                }
            }
        })
    }
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/signin')
})

module.exports = router;