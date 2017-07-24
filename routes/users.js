const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Save User Token
router.post('/regtoken', (req,res,next)=>{
  let id = req.body.user_id
  let token = req.body.token
  User.addRegToken(id,token,(err,user)=>{
    if(err){
      return res.json({success:false,msg:err})
    }
    else if(user){
      return res.json({user:user,success:true,msg:"registration token added"})
    }else{
      return res.json({success:false,msg:"No user found"})
    }
  })
})

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username , (err, user)=>{
    if(err) throw err;
    if(!user){
      res.json({ 'success': false , "msg": "User not found"});
    }else
    {
      User.comparePassword(password,user.password, (err , isMatch)=>{
        if (err) throw err;
        if(isMatch){
          const token = jwt.sign(user,config.secret,{
            expiresIn: 604800
          });
          
          res.json({
            "success": true,
            "token": "JWT "+token,
            "user":user
            
          });
          
        }else
        {
          res.json({ 'success': false , "msg": "Wrong password"});
        }
      });
    }
  });
});

// Profile
router.get('/profile' , passport.authenticate('jwt',{session:false}), (req, res, next) => {
  res.json({ "user":req.user});
});


//Get user by Username
router.get('/get/:username',(req,res,next)=>{
    User.getUserByUsername(req.params.username,(err,user)=>{
        if(err){
            res.json({success: false , msg : "failed to get user"})
            throw err;
        }
        if (!user){
                res.json({success: false , msg : "User not found"})
        }else{
            res.json({user : user , success: true , msg : "User extraction successfull"});
        }
    });
})


module.exports = router;
