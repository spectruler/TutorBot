const async = require('async')
      User = require('../models/user'),
      Message = require('../models/message')

const friendResults = {}

friendResults.PostRequest = function(req,res,url){
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
        res.redirect(url);
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
        },
        function(callback){
            if(req.body.chatId){
                console.log('req')
                Message.update({
                    '_id': req.body.chatId
                },{"isRead":true},(err,done)=>{
                    console.log(done)
                    callback(err,done)
                })
            }
        }
    ],(err,results)=>{
        res.redirect(url)
    })
}

module.exports = friendResults