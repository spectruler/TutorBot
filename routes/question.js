const router = require('express').Router(),
      middleware = require('../middleware'),
      User = require('../models/user'),
      async = require('async'),
      Message = require('../models/message'),
      FriendResults = require('../middleware/friendResults'),
      Group = require('../models/groupmessage')

router.get('/:id/:problem',middleware.isLoggedIn,(req,res)=>{ //:id belong to the user who is going to post that
    const name = req.params.problem
    const id = req.params.id
    async.parallel([
        function(callback){
            User.findOne({'username':req.user.username}).populate('request.useId').exec((err,result)=>{
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
               }
            ],function(err,newResult){
                   callback(err,newResult);
               }
           )
       },
       function(callback){
        Group.find({}).populate('sender').exec((err,result)=>{
            callback(err,result)
        })
    }
    ],(err,results)=>{
        const result = results[0]
        const result2 = results[1]
        const result3 = results[2]
         res.render('publicchat/group',{title:"public chat",user:req.user,groupName:name,data:result,chat:result2,groupMsg: result3,channelId:id})

    })
})

router.post('/:name',function(req,res){
    //FriendResults.PostRequest(req,res,'/question/'+req.params.id+"/"+req.params.name)
    FriendResults.PostRequest(req,res,'/question/'+req.params.name)
    async.parallel([
       function(callback){
           if(req.body.message){
                const group = new Group();
                group.sender = req.user._id;
                group.body = req.body.message;
                group.name = req.body.group;
                //group.channelId = req.body.id;
                group.createdAt = new Date(); 
                group.save((err,msg)=>{
                    callback(err,msg)
                })
           }
       } 
    ],(err,results)=>{
        res.redirect('/question/'+req.params.name)
    })

})

module.exports = router;
 