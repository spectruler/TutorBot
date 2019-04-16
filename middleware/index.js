const validator = require("express-validator")
const middlewareObj = {}


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

module.exports = middlewareObj