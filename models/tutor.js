var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

TutorSchema = new mongoose.Schema({
    firstName: {type:String},
    lastName: {type:String},
    tutorImage: String,
    graduation: String,
    school: String,
    major: String,
    country: String,
    email: String,
    password: String
})
mongoose.plugin(passportLocalMongoose)

module.exports = mongoose.model('Tutor',TutorSchema)