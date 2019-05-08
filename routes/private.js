const router = require('express').Router(),
      async = require('async'),
      User = require('../models/user'),
      middleware = require('../middleware'),
      Message = require('../models/message')
      FriendResults = require('../middleware/friendResults')


router.get('/chat/:name',middleware.isFriend,(req,res)=>{
    
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
                }],function(err,newResult){
                    callback(err,newResult);
                }
            )
        },
        function(callback){
            Message.find({'$or':[{'senderName':req.user.username},{'receiverName':req.user.username}]}).populate('author')
            .populate('receiver').exec((err,result3)=>{
                callback(err,result3)
            })
        }

    ],(err,results)=>{
        const result = results[0]
        const result1 = results[1]
        const result2 = results[2]

            const params= req.params.name.split('-')
            const nameParams = params[0]
    
            res.render('private/privatechat',{title:"Private Chat",user:req.user,data:result,chat:result1,chats:result2,name:nameParams})
        
    })
})

router.post('/chat/:name',middleware.isFriend,(req,res,next)=>{
    const params= req.params.name.split('-')
    const nameParams = params[0]
    const nameRegex = new RegExp("^"+nameParams.toLowerCase(), 'i') // receiver username



    async.waterfall([ // In watefall pass ones result in next function
        function (callback){
            if(req.body.msg){
                User.findOne({'username':{$regex: nameRegex}},(err,data)=>{
                    if((data.status === 'tutor' || req.user.status === 'tutor')){
                        if(!(data.status === 'tutor' && req.user.status === 'tutor')){
                            callback(err,{data:data,val:true})
                        }
                    }else{
                        callback(err,{data:data,val:false})
                    }
                })
            }
        },
        function(data,callback){
            val = data.val;
            data = data.data;
            if(req.body.msg){
                const newMessage = new Message()
                newMessage.author = req.user._id
                newMessage.receiver = data._id;
                newMessage.senderName = req.user.username
                newMessage.receiverName = data.username
                newMessage.message = req.body.msg;
                if (val== true){
                    newMessage.paymentRequired = true;
                    //check if last message was paymentapproved if so approve it too
                }
                newMessage.userImage = req.user.UserImage;
                newMessage.createdAt = new Date()
                newMessage.save((err,result)=>{
                    if(err){
                        return next(err)
                    }else{
                        callback(err,result)
                    }
                })
            }
        }
    ],(err,results)=>{
        res.redirect('/private/chat/'+req.params.name);
    }) ;
    FriendResults.PostRequest(req,res,'/private/chat/'+req.params.name);
    
})

router.get('/payment/:name',middleware.isLoggedIn,(req,res)=>{

    async.parallel([
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
        const r1 = results[0]
        const r2 = results[1]
        res.render('payment',{chat:r2,user:req.user,data:r1,names:req.params.name})
    })
})

router.post('/payment/:name',(req,res)=>{
    var names = req.params.name.split("-");
    async.parallel([
        function(callback){
            Message.find({senderName:names[1],receiverName:names[0]},(err,msg)=>{
                msg.forEach(function(m){
                    m.paymentApproved = true;
                    m.save();
                })
                callback(err,msg);
            })
        }

    ],(err,results)=>{
        res.redirect('/private/chat/'+req.params.name)
    })

})



module.exports = router;