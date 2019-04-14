var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

TutorSchema = new mongoose.Schema({
    firstName: {type:String},
    lastName: {type:String},
    cell: {type:Number, unique: true},
    tutorImage: String,
    graduation: Date,
    school: String,
    majors: String,
    country: String,
    email: String,
    password: String
})
mongoose.plugin(passportLocalMongoose)

module.exports = mongoose.model('Tutor',TutorSchema)