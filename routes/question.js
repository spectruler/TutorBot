const router = require('express').Router(),
      middleware = require('../middleware')

router.get('/:id/:problem',middleware.isLoggedIn,(req,res)=>{ //:id belong to the user who is going to post that
    const name = req.params.problem
    res.render('publicchat/group',{title:"public chat",user:req.user,groupName:name})
})

module.exports = router;
