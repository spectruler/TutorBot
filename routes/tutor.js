const router = require('express').Router(),
      path = require('path'),
      fs = require('fs'),
      formidable = require('formidable'),
      Tutor = require('../models/tutor'),
      Field = require("../models/field"),
      middleware = require('../middleware')

router.get('/info',middleware.isTutorLoggedIn,function(req,res){
    res.render('tutor/info',{user:req.user})
})

router.post('/upload',function(req,res){
    var form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/uploads')
    form.on('file',(field,file)=>{
        fs.rename(file.path,path.join(form.uploadDir,file.name),(err)=>{
            if (err) throw err;
            console.log('File named successfully')
        })
    })
    
    form.on('error',(err)=>{
        console.log(err)
    })

    form.on('end',()=>{
        console.log('File upload is successful')
    })

    form.parse(req)

})

router.post('/info',middleware.isTutorLoggedIn,(req,res)=>{
    req.body.tutor.firstname = req.user.firstname
    req.body.tutor.lastname = req.user.lastname
    req.body.tutor.email = req.user.username
    console.log(req.body.tutor)
    Tutor.create(req.body.tutor,(err,tutor)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/tutor/info')
        }else{
            res.redirect('/tutor/add/subject')
        }
    })
})

router.get('/add/subject',middleware.isTutorLoggedIn,(req,res)=>{
    // show fields in subjects
    //reference them in tutor field
    Field.find({},(err,field)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/')
        }else{
            res.render('tutor/addsubject',{fields:field})
        }
    })
})

router.post('/add/subject',middleware.isTutorLoggedIn,(req,res)=>{
    if(req.body.tutor == null){
        console.log(true)
        req.flash('error','choose atleast one subject')
        return res.redirect('/tutor/add/subject')
    }
    Tutor.findOne({email:req.user.username},function(err,tutor){
        if(err){
            console.log(err)
            req.flash('error',err)
        }else{
            tutor.subjects.push(req.body.tutor.subjects)
            tutor.save()
            res.redirect('/')
        }
    })
})

module.exports = router