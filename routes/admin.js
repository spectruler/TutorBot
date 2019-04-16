const express = require('express'),
      router = express.Router(),
      Field = require('../models/field'),
      path = require('path'), // to store files on particular path temporarly
      fs = require('fs'), //rename file
      formidable = require('formidable')

router.get('/dashboard',function(req,res){
    Field.find({},function(err,field){
        if(err){
            console.log(err)
            req.flash("error",err)
        }else{
            res.render('admin/dashboard',{fields:field})
        }
    })
})


module.exports = router