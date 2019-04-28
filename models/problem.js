const mongoose = require('mongoose'),
      ProblemSchema = new mongoose.Schema({
            statement: {type:String},
            tag: {type:String}, //tags of subject
            author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            },
            fans: [{
                id: {type:mongoose.Schema.Types.ObjectId,
                ref:"User"},
                username: String
            }],
            image: {type:String, default:"/default/FILE.jpeg"}
            ,
            createdDate: {type:Date,default:Date.now()}
      })

module.exports = mongoose.model('Problem',ProblemSchema)