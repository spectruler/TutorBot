const router = require('express').Router(),
      Problem = require('../models/problem'),
      async = require('async'),
      Field = require('../models/field'),
      Tutor = require('../models/tutor'),
      _ = require('lodash')

router.get('/results',(req,res)=>{
    res.redirect('/')
})

router.post('/results',(req,res)=>{
    async.parallel([
        function(callback){
            const regex = new RegExp((req.body.country),'gi');

            Problem.find({'tag':regex},(err,result)=>{
                callback(err,result)
            })

        },
        function(callback){
            Tutor.aggregate([
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

        res.render('results',{user:req.user, data: dataChunk,fields:result2})
    })
})

module.exports = router