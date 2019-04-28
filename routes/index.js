const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user'),
      async = require('async'),
      _ = require('lodash'),
      Field = require('../models/field'),
      middleware = require('../middleware'),
      Problem = require('../models/problem'),
      Message = require('../models/message'),
      FriendRequest = require('../middleware/friendResults'),
      Group = require('../models/groupmessage')



router.get('/',middleware.isLoggedIn,function(req,res){

    async.parallel([
        function(callback){
            Problem.find({},(err,problem)=>{
                    callback(err,problem)
            })
        },

        function(callback){
            User.aggregate([
                {$group: {_id: "$subjects"}} // check later
            ],(err,result)=>{
                callback(err,result)
            })
        },

        function(callback){
            User.findOne({'username':req.user.username}).populate('request.userId').exec((err,result)=>{
                callback(err,result)
            })
        },
        function(callback){
            const nameRegex = new RegExp("^"+req.user.username.toLowerCase(), 'i')

           Message.aggregate([
               {$match: {$or:[{'senderName':nameRegex},{'receiverName':nameRegex}]}},
               {$sort:{'createdAt':-1}},
               {   $group: {"_id":{
                       "last_message_between":{
                           $cond:[
                               {
                                   $gt: [
                                       {$substr:["$senderName",0,1]},
                                       {$substr:["$receiverName",0,1]}
                                   ]
                               },
                               {$concat: ["$senderName"," and ","$receiverName"]},
                               {$concat: ["$receiverName"," and ","$senderName"]}

                           ]
                       }
                   }, "body":{$first:"$$ROOT"}
               }
               }],function(err,newResult){
                   callback(err,newResult);
               }
           )
       }

    ],(err,problem)=>{
        if(err){
            console.log(err)
        }
        const tut = problem[0] //callbacks using indexes //instead of tutor push questions 
        const result2 = problem[1]; //second callback sinces index starts from 0 
        const result3 = problem[2];
        const result4 = problem[3];
        //console.log(result2)

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < tut.length;i += chunkSize ){
            dataChunk.push(tut.slice(i,i+chunkSize))
        }

        const sub_sort = _.sortBy(result2,'_id') //not working
        //console.log(sub_sort)

        //console.log('data: '+dataChunk)
        res.render('index',{title:'Online Tutor Bot - Home',chunks:dataChunk,fields:result2,user:req.user,data:result3,chat: result4})                
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
                callback(err,count);
            });
        }
    ],(err,results)=>{
        res.redirect('/')
    })
    FriendRequest.PostRequest(req,res,'/')
})

router.post('/post',middleware.isLoggedIn,(req,res)=>{
    //add a way to add automatic relative tutors in this group
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.problem.author = author
    Problem.create(req.body.problem,(err,problem)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/')
        }else{
            req.flash('success','Successfully posted')
                // find users
            User.find({"subjects":req.body.problem.tag, "status":"tutor"},(err,user)=>{
                user.forEach(function(val){
                    //add group
                   problem.fans.push({id:user.id,username:user.username})
                   problem.save()
                })
            })
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
            user.friendList.push({friendId:user._id,friendName:user.username});
            user.save();
                res.redirect("/")
            }else{

            user.friendList.push({friendId:user._id,friendName:user.username});
            user.save();
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
        User.findOne({'username':req.user.username},(err,tutor)=>{
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