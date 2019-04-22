const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user'),
      async = require('async'),
      _ = require('lodash'),
      Tutor = require('../models/tutor'),
      Field = require('../models/field'),
      middleware = require('../middleware'),
      Problem = require('../models/problem')



router.get('/',middleware.isLoggedIn,function(req,res){

    async.parallel([
        function(callback){
            Problem.find({},(err,problem)=>{
                    callback(err,problem)
            })
        },

        function(callback){
            Tutor.aggregate([
                {$group: {_id: "$subjects"}} // check later
            ],(err,result)=>{
                callback(err,result)
            })
        }

    ],(err,problem)=>{
        if(err){
            console.log(err)
        }
        const tut = problem[0] //callbacks using indexes //instead of tutor push questions 
        const result2 = problem[1]; //second callback sinces index starts from 0 
        //console.log(result2)

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < tut.length;i += chunkSize ){
            dataChunk.push(tut.slice(i,chunkSize))
        }

        const sub_sort = _.sortBy(result2,'_id') //not working
        //console.log(sub_sort)

        //console.log('data: '+dataChunk)
        res.render('index',{title:'Online Tutor Bot - Home',data:dataChunk,fields:result2,user:req.user})                
    })
})

router.post('/',middleware.isLoggedIn,(req,res)=>{
    async.parallel([
        function(callback){
            Problem.update({"_id":req.body.id,
                'fans.username':{$ne: req.user.username}
            },{
                $push: {fans:{ username:req.user.username}}
            },(err,count)=>{
                console.log(count)
                callback(err,count);
            });
        }
    ],(err,results)=>{
        res.redirect('/')
    })
})

router.post('/post',middleware.isLoggedIn,(req,res)=>{
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.problem.author = author
    console.log('tag: '+req.body.problem.tag)
    console.log(req.body.problem)
    Problem.create(req.body.problem,(err,problem)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/')
        }else{
            req.flash('success','Successfully posted')
            res.redirect('/')
        }
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
            req.flash("success","Welcome to online tutor bot "+ user.firstname +" "+ user.lastname)
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
        Tutor.findOne({'author.username':req.user.username},(err,tutor)=>{
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
    req.session.destroy((err)=>{
        res.redirect('/signin')
    })
})

module.exports = router;