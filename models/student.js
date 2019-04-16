var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')


var StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
    //continue

})

mongoose.plugin(passportLocalMongoose)

module.exports = mongoose.model('Student',StudentSchema)