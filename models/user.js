var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

    UserSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        username: {type:String, unique:true},
        password: String,
        status: String, //student / teacher
        google: {type:String, default: ''},
        googleTokens: Array

    })
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)