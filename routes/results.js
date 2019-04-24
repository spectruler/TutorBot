const router = require('express').Router(),
      Problem = require('../models/problem'),
      async = require('async'),
      Field = require('../models/field'),
      _ = require('lodash'),
      User = require('../models/user'),
      middleware = require('../middleware')

router.get('/results',middleware.isLoggedIn,(req,res)=>{
    res.redirect('/')
})

router.post('/results',middleware.isLoggedIn,(req,res)=>{
    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.country),'gi');

            Problem.find({'tag':regex},(err,result)=>{
                callback(err,result)
            })

        },
        function(callback){
            User.aggregate([
                {$group: {_id: "$subjects"}}
            ],(err,result)=>{
                callback(err,result)
            })
        }
    ],(err,results)=>{
        const result1 = results[0]
        const result2 = results[1]

        const dataChunk = []
        const chunkSize = 3;
        for (let i = 0 ; i < result1.length;i += chunkSize ){
            dataChunk.push(result1.slice(i,chunkSize))
        }

        res.render('results',{user:req.user, chunks: dataChunk,fields:result2})
    })

})

router.get('/members',middleware.isLoggedIn,(req,res)=>{

    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.country),'gi');

            User.find({},(err,result)=>{
                callback(err,result)
            })

        },
        function(callback){
            User.aggregate([
                {$group: {_id: "$subjects"}}
            ],(err,result)=>{
                callback(err,result)
            })
        }
    ],(err,results)=>{
        const result1 = results[0]
        const result2 = results[1]

        const dataChunk = []
        const chunkSize = 4;
        for (let i = 0 ; i < result1.length;i += chunkSize ){
            dataChunk.push(result1.slice(i,chunkSize))
        }

        res.render('members',{user:req.user, chunks: dataChunk,fields:result2})
    })
})

router.post('/members',(req,res)=>{
    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.username),'gi'); //gi stands for globally ignoring case

            User.find({'username':regex},(err,result)=>{
                callback(err,result)
            })

        },
        function(callback){
            User.aggregate([
                {$group: {_id: "$subjects"}}
            ],(err,result)=>{
                callback(err,result)
            })
        }
    ],(err,results)=>{
        const result1 = results[0]
        const result2 = results[1]

        const dataChunk = []
        const chunkSize = 4;
        for (let i = 0 ; i < result1.length;i += chunkSize ){
            dataChunk.push(result1.slice(i,chunkSize))
        }

        res.render('members',{user:req.user, chunks: dataChunk,fields:result2})
    })
})

module.exports = router