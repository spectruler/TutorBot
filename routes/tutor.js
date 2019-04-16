const router = require('express').Router(),
      path = require('path'),
      fs = require('fs'),
      formidable = require('formidable'),
      Tutor = require('../models/tutor')

router.get('/info',function(req,res){
    res.render('tutor/info',{user:req.user})
})

router.post('/upload',function(req,res){
    console.log("entered in info post mode")
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

router.post('/info',(req,res)=>{
    req.body.tutor.firstname = req.user.firstname
    req.body.tutor.lastname = req.user.lastname
    req.body.tutor.email = req.user.username
    Tutor.create(req.body.tutor,(err,tutor)=>{
        if(err){
            console.log(err)
            req.flash('error',err)
            res.redirect('/tutor/info')
        }else{
            res.redirect('/')
        }
    })
})

module.exports = router