const mongoose = require('mongoose'),
      ProblemSchema = new mongoose.Schema({
            statement: {type:String},
            author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            }
      })

module.exports = mongoose.model('Problem',ProblemSchema)