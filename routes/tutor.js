const router = require('express').Router(),
      path = require('path'),
      fs = require('fs'),
      formidable = require('formidable'),
      Tutor = require('../models/tutor'),
      Field = require("../models/field"),
      User = require('../models/user'),
      middleware = require('../middleware'),
      async = require('async'),
      Message = require('../models/message')

router.get('/info',middleware.isTutorLoggedIn,function(req,res){
    res.render('tutor/info',{user:req.user})
})

router.post('/upload',function(req,res){
    var form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/uploads')
    form.on('file',(field,file)=>{
        fs.rename(file.path,path.join(form.uploadDir,file.name),(err)=>{
            if (err) throw err;
            console.log('File named successfully')
        })
    })
    
    form.on('error',(err)=>{
        console.log(err)
    })

    form.on('end',()=>{
        console.log('File upload is successful')
    })

    form.parse(req)

})

router.post('/info',middleware.isTutorLoggedIn,(req,res)=>{

    User.findByIdAndUpdate(req.user._id,req.body.tutor,(err,tutor)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/tutor/info')
        }else{
            res.redirect('/tutor/add/subject')
        }
    })
})

router.get('/add/subject',middleware.isTutorLoggedIn,(req,res)=>{
    Field.find({},(err,field)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/')
        }else{
            res.render('tutor/addsubject',{fields:field})
        }
    })
})

router.post('/add/subject',middleware.isTutorLoggedIn,(req,res)=>{
    if(req.body.tutor == null){
        req.flash('error','choose atleast one subject')
        return res.redirect('/tutor/add/subject')
    }
    User.findById(req.user._id,function(err,tutor){
        if(err){
            console.log(err)
            req.flash('error',err)
        }else{
            try{
                req.body.tutor.subjects.forEach(function(sub){
                    tutor.subjects.push(sub)
                })
            }
            catch{
                tutor.subjects.push(req.body.tutor.subjects)
            }

            tutor.save()
            res.redirect('/')
        }
    })
})

router.get('/search',middleware.isLoggedIn,(req,res)=>{
    res.redirect('/tutor')
})

router.get('/results',middleware.isLoggedIn,(req,res)=>{
    res.redirect('/tutor')
})


router.get('/',middleware.isLoggedIn,(req,res)=>{
    async.parallel([
        function(callback){
            User.find({'status':'tutor'},(err,problem)=>{
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
        res.render('tutor/index',{title:'Online Tutor Bot - Tutors',chunks:dataChunk,fields:result2,user:req.user,data:result3,chat: result4})                
    })
})

router.post('/search',middleware.isLoggedIn,(req,res)=>{
    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.tutorsearch),'gi') //tutor
            User.find({'username':regex,'status':'tutor'},(err,foundTutor)=>{
                callback(err,foundTutor)
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

    ],(err,results)=>{
        if(err){
            console.log(err)
        }
        const tut = results[0] //callbacks using indexes //instead of tutor push questions 
        const result2 = results[1]; //second callback sinces index starts from 0 
        const result3 = results[2];
        const result4 = results[3];
        //console.log(result2)

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < tut.length;i += chunkSize ){
            dataChunk.push(tut.slice(i,i+chunkSize))
        }
        res.render('tutor/index',{title:'Online Tutor Bot - Tutors',chunks:dataChunk,fields:result2,user:req.user,data:result3,chat: result4})                
    })

})



router.post("/results",(req,res)=>{
    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.country),'gi') //tutor
            User.find({'subjects':regex,'status':'tutor'},(err,foundTutor)=>{
                console.log(foundTutor)
                callback(err,foundTutor)
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

    ],(err,results)=>{
        if(err){
            console.log(err)
        }
        const tut = results[0] //callbacks using indexes //instead of tutor push questions 
        const result2 = results[1]; //second callback sinces index starts from 0 
        const result3 = results[2];
        const result4 = results[3];
        //console.log(result2)

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < tut.length;i += chunkSize ){
            dataChunk.push(tut.slice(i,i+chunkSize))
        }
        res.render('tutor/index',{title:'Online Tutor Bot - Tutors',chunks:dataChunk,fields:result2,user:req.user,data:result3,chat: result4})                
    })

})

module.exports = router