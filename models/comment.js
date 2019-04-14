var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({
    text: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //still issue b/w student and teacher
        },
        username: String //open prfiles on click
    }
})