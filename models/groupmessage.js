const mongoose = require('mongoose')
var GroupChat = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
},
    body: String,
    name: String,
    channelId: String,
    createdAt: {type: Date, default: Date.now()}

})

module.exports = mongoose.model('GroupChat',GroupChat);