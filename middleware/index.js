const validator = require("express-validator")
const middlewareObj = {}
const User = require('../models/user')


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('error','You need to be logged in')
        res.redirect('/signin')
    }
}

middlewareObj.isTutorLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        //check for tutor
        if(req.user.status == 'tutor'){
            return next()
        }else{
            req.flash('error','You need to be logged in as Tutor')
            res.redirect('/signin')
        }

    }else{
        req.flash('error','You need to be logged in')
        res.redirect('/signin')
    }
}

middlewareObj.isFriend = function(req,res,next){
    if(req.isAuthenticated()){
        var name = req.params.name.split("-");
        if(name[1] === req.user.username){
            var check_friend = name[0];
            User.findOne({'username':name[1],'friendList.friendName':{$in: check_friend}},(err,found)=>{
                if(err){
                    console.log(err)
                }else{
                    if(found == null){
                        req.flash("error","You should have connection with other member");
                        res.redirect('back');
                    }else{
                        if(req.user.status === 'student'){
                            var names = req.params.name.split('-')
                
                            if(names[1] == req.user.username){
                                Message.find({senderName:req.user.username, receiverName:names[0]},(err,msg)=>{
                                    if(msg.length >= 5 && msg[0].paymentApproved == false){
                                        req.flash('error',"You need to pay to continue");
                                        res.redirect('/private/payment/'+req.params.name);
                                    }else if( msg.length < 5){
                                        if(msg.length > 0 && msg[0].paymentApproved == false){
                                        req.flash('error',"Note you have not paid after 5 messages your messages will not be recorded")
                                        next();
                                        }else{
                                            console.log('in else')
                                            req.flash('error',"Note you have not paid after 5 messages your messages will not be recorded")
                                            next();
                                        }
                                    }else{
                                        next();
                                    }
                                })
                
                            }
                        }
                    }
                }
            })
        }
        
    }else{
        req.flash('error','You need to be logged in')
        res.redirect('/signin')
    }

}

middlewareObj.isPayed = function(req,res,next){
    if(req.isAuthenticated()){



    }else{
        req.flash('error','You need to be logged in')
        res.redirect("/signin")
    }
}

module.exports = middlewareObj