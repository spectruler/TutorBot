const express = require('express'),
      router = express.Router(),
      Field = require('../models/field'),
      path = require('path'), // to store files on particular path temporarly
      fs = require('fs'), //rename file
      formidable = require('formidable')

router.get('/dashboard',(req,res)=>{
    Field.find({},function(err,field){
        if (err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/add')
        }else{

            res.render('admin/view',{fields:field})
        }
    })
})

router.get('/add',function(req,res){
    Field.find({},function(err,field){
        if(err){
            console.log(err)
            req.flash("error",err)
        }else{
            res.render('admin/dashboard',{fields:field})
        }
    })
})

router.post('/add',function(req,res){
    Field.findOne({'field':req.body.field.field},(err,field)=>{
        if (err){
            //field already doesn't exist add
            Field.create(req.body.field,(err,field)=>{
                if(err){
                    console.log(err)
                    req.flash('error',err)
                    res.redirect('/admin/add')
                }else{
                    req.flash('success','Successfully added')
                    res.redirect('/admin/dashboard')
                }
            })

        }else{
            field.subject.push(req.body.field.subject)
            field.save()

            req.flash('success','Successfully added')
            res.redirect('/admin/dashboard')
        
            /*
            Field.findOneAndUpdate(field.field,(err,fields)=>{
                if(err){
                    console.log(err)
                    req.flash('error','Could not perform action')
                    res.redirect('/admin/add')
                }else{
                    req.flash('success','Successfully added')
                    res.redirect('/admin/dashboard')
                }
            })*/
            
        }
    })
})


module.exports = router