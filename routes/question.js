const router = require('express').Router(),
      middleware = require('../middleware'),
      User = require('../models/user'),
      async = require('async')

router.get('/:id/:problem',middleware.isLoggedIn,(req,res)=>{ //:id belong to the user who is going to post that
    const name = req.params.problem
    res.render('publicchat/group',{title:"public chat",user:req.user,groupName:name})
})

router.post('/:name',function(req,res){
    async.parallel([
        function callback(){
            if(req.body.receiverName){
                User.update({
                    'username':req.body.receiverName,
                    'request.userId': {$ne: req.user._id},
                    'friendList.friendId':{$ne: req.user._id}
                },
                {
                    $push: {request:{
                        userId: req.user._id,
                        username: req.user.username
                    }}, //push data in mongodb  
                    $inc: {totalRequest: 1} //increment totalRequest by 1
                },(err,count)=>{
                    callback(err,count);    
                })
            }
        }, function(callback){
            if (req.body.receiverName){
                User.update({
                    'username': req.user.username,
                    'sentRequest.username': {$ne: req.body.receiverName}
                },{
                    $push: {sentRequest:{username: req.body.receiverName}}
                },(err,count)=>{
                    callback(err,count)
                })
            }
        }
    ], (err,results)=>{
        res.redirect('/question/'+req.params.name);
    })
    async.parallel([
        //this function is updated for the receiver of the friend request when it is accepted
        function(callback){
            if(req.body.senderId){
                User.update({
                    '_id': req.user._id,
                    'friendList.friendId':{$ne: req.body.senderId}
                },{
                    $push:{
                        friendList:{
                            friendId: req.body.senderId,
                            friendName: req.body.senderName
                        }
                    },
                    $pull:{
                        request: {
                            userId: req.body.senderId,
                            username: req.body.senderName
                        }
                    },
                    $inc: {totalRequest: -1}
                },(err,count)=>{
                    callback(err,count)
                })
            }
        }, 
        //this function is updated for the sender of the friend request when it is accepted by
        //the receiver

        function(callback){
            if(req.body.senderId){
                User.update({
                    '_id': req.body.senderId,
                    'friendList.friendId':{$ne: req.user._id}
                },{
                    $push:{
                        friendList:{
                            friendId: req.user._id,
                            friendName: req.user.username
                        }
                    },
                    $pull:{
                        sentRequest: {
                            username: req.user.username
                        }
                    }
                },(err,count)=>{
                    callback(err,count)
                })
            }
        },
       
        function(callback){
            if(req.body.user_Id){
                User.update({
                    '_id': req.user._id,
                    'request.userId':{$eq: req.body.user_Id}
                },{
                    $pull:{
                        request: {
                            userId: req.body.user_Id 
                        }
                    },
                    $inc: {totalRequest: -1}
                },(err,count)=>{
                    callback(err,count)
                })
            }
        },
        function(callback){
            if(req.body.user_Id){
                User.update({
                    '_id': req.body.userId,
                    'sentRequest.username':{$eq: req.user.username}
                },{
                    $pull:{
                        sentRequest: {
                            username: req.user.username
                        }
                    }
                },(err,count)=>{
                    callback(err,count)
                })
            }
        }
    ],(err,results)=>{
        res.redirect('/question/'+req.params.name)
    })
})

module.exports = router;
