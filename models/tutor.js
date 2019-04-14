var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

TutorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    cell: Number,
    photoUrl: String,
    graduation: Date,
    school: String,
    majors: String,
    country: String,
    email: String,
    password: String
})
mongoose.plugin(passportLocalMongoose)

module.exports = mongoose.model('Tutor',TutorSchema)