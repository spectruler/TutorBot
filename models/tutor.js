var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

TutorSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    tutorImage: String,
    graduation: String,
    school: String,
    major: String,
    country: String,
    email: {type: String, unique:true, require:true},
    password: String,
    subjects: [String]
})
mongoose.plugin(passportLocalMongoose)

module.exports = mongoose.model('Tutor',TutorSchema)