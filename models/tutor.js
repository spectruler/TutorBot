var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

TutorSchema = new mongoose.Schema({
    tutorImage: String,
    graduation: String,
    school: String,
    major: String,
    country: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        firstname: String,
        lastname: String
    },
    subjects: [{type:String, require:true}]
})

module.exports = mongoose.model('Tutor',TutorSchema)