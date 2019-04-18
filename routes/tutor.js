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
    console.log('/info')
    var author = {
        id: req.user._id,
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname
    }
    req.body.tutor.author = author
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
    Tutor.findOne({'author.id':req.user._id},function(err,tutor){
        if(err){
            console.log(err)
            req.flash('error',err)
        }else{
            try{
                req.body.tutor.subjects.forEach(function(sub){
                    tutor.subjects.push(sub)
                })
            }
            catch{
                tutor.subjects.push(req.body.tutor.subjects)
            }

            tutor.save()
            res.redirect('/')
        }
    })
})

module.exports = router