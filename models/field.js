const mongoose = require('mongoose'),
      FieldSchema = new mongoose.Schema({

        field: {type: String}, // use dynamic behaviour if field is other than take field as input
        subject: [{type:String}]

      })

module.exports = mongoose.model("Field",FieldSchema)