var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

    UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        status: String //student / teacher

    })
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)