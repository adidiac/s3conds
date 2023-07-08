var express = require('express');
var router = express.Router();
var User=require('../schema/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async (req,res)=>{
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const newUser = new User({ email: req.body.email, password: req.body.password,rol:'guest',websites:[] });
    await newUser.save();
    res.status(200).json(newUser)
  }
  else{
    res.status(400).json({message:'user already exists'})
  }
})


router.post('/login',async (req,res)=>{
  const user= await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({message:'user does not exist'})
  }
  else{
    if(user.password===req.body.password){
      res.status(200).json(user)
    }
    else{
      res.status(400).json({message:'wrong password or username'})
    }
  }
})


module.exports = router;
