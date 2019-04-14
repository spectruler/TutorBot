//acts as server

var express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user')
    

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static("public"))
app.use(methodOverride("_method"))

app.get("/",(req,res)=>{
    res.render("index.ejs")
})


app.listen(3000,()=>{
    console.log("Online Tutor Bot has been Started!")
})