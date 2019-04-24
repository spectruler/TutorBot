const mongoose = require('mongoose')

var MessageSchema = new mongoose.Schema({
    message: {type: String},
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    senderName : {type: String},
    receiverName: {type: String},
    userImage: {type: String,default: 'studentPic.png'},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
     
});

module.exports = mongoose.model('Message',MessageSchema)
