var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

    UserSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        username: {type:String, unique:true},
        password: String,
        status: {type: String, require:true}, //student / teacher
        sentRequest:[{
                username: {type: String, default:''}
        }],
        request:[{
            userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
            username: {type:String, default: ''}
        }],
        friendList:[{
            frientId: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            friendName:{type:String, default:''}
        }],
        totalRequest: {type: Number, default:0},  
    
        
        userImage: {type:String, default: "default/Student.png"},
        graduation: String,
        school: String,
        major: String,
        country: String,
        subjects: [{type:String, require:true}]
        
    })
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)