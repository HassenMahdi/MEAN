const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');
const Team = require('../models/team');
const User = require('../models/user');

var multer  = require('multer')
var imageBasePath = '/uploads/images/' 
var storage = multer.diskStorage({
    destination: function(err,file,cb){
        cb(null, "./public"+imageBasePath)
    },
    filename:function(err,file,cb){
        if( !file.originalname.match(/\.(jpeg|png|gif)$/) ){
            var err = Error()
            err.code = "WRONG_FILE_TYPE"
            cb(err)
        }else{
            cb(null, Date.now()+"_"+file.originalname )
        }
    }
})

var endPoint = "http://localhost:3000"

var uploadImage = multer({ 
    storage:storage,
    limits: {fileSize:4000000},
}).single('image')


router.post('', uploadImage ,(req,res,next)=>{
    let user_id = req.body.user_id
    uploadImage(req,res,(err)=>{
        if(err || !req.file ){
            return res.json({success:false,msg:"No file recieved"})
        }else{
            User.changeImage(user_id,endPoint+imageBasePath+req.file.filename,(err,user)=>{
                if(err || !user){
                    return res.json({success:false,msg:"We have encouterd a probelem"})
                }
                else
                    return res.json({success:true,msg:"Got the file"})
            })
        }
    })
})

module.exports = router;