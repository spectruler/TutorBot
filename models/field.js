const mongoose = require('mongoose'),
      FieldSchema = new mongoose.Schema({

        field: {type: String, unique:true}, // use dynamic behaviour if field is other than take field as input
        subject: [{type:String}] //modify latter to 3 tiers
        

      })

module.exports = mongoose.model("Field",FieldSchema)