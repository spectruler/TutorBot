//acts as server
//importing libs
const express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    path = require('path'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    cookieParser = require('cookie-parser'),
    validator = require('express-validator'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    formidable = require('formidable'),
    User = require('./models/user'),
    Field = require('./models/field'),
    Tutor = require('./models/tutor'),
    FriendResult = require('./middleware/friendResults')
    Message = require('./models/message'),
    {Users} = require('./middleware/UsersClass'),//structuring ES6,
    {Global} = require('./middleware/Global')

//importing routes
const IndexRoutes = require('./routes'),
      AdminRoutes = require('./routes/admin.js'),
      TutorRoutes = require('./routes/tutor'),
      QuestionRoutes = require('./routes/question'),
      ResultRoutes = require('./routes/results'),
      PrivateRoutes = require('./routes/private')

//importing middleware
const middleware = require('./middleware')


require('./socket/groupchat')(io,Users)
require('./socket/request')(io)
require('./socket/globalroom')(io,Global)
require('./socket/privatemsg')(io)

    

global.Promise
mongoose.connect('mongodb://localhost/online_tutor_bot')

app.set('view engine','ejs')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(cookieParser())
app.use(validator())
app.use(session({
    secret: 'Key should be secret to mouth',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//after middleware or session
app.use(passport.initialize())
app.use(passport.session())

app.locals._ = _ //declaring as global local

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})




//using routes
app.use(IndexRoutes)
app.use('/admin',AdminRoutes)
app.use("/tutor",TutorRoutes)
app.use('/question',QuestionRoutes)
app.use(ResultRoutes)
app.use('/private',PrivateRoutes)


//const server = http.createServer(app)
http.listen(3000,()=>{
    console.log("Online Tutor Bot has been Started!")
})