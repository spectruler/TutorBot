var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

    UserSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        username: {type:String, unique:true},
        password: String,
        status: String, //student / teacher
        google: {type:String, default: ''},
        googleTokens: Array,
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
        totalRequest: {type: Number, default:0}        
        
    })
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)