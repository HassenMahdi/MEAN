const express = require('express');
const path = require('path')
const fs = require('fs')
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
            err.code = "WRONG_IMAGE_TYPE"
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

router.post('/image', uploadImage ,(req,res,next)=>{
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

var fileBasePath = 'uploads/files/' 
var fileStorage = multer.diskStorage({
    destination: function(err,file,cb){
        cb(null, fileBasePath)
    },
    filename:function(err,file,cb){
        if( !file.originalname.match(/\.(txt|doc|docx|pdf|odt|jpg|png|jpeg|gif|zip|rar)$/) ){
            var err = Error()
            err.code = "WRONG_FILE_TYPE"
            cb(err.code,"")
        }else{
            cb(null, Date.now()+"_"+file.originalname )
        }
    }
})

var uploadFile = multer({ 
    storage:fileStorage,
    limits: {fileSize:4000000},
}).single('file')

router.post('', uploadFile ,(req,res,next)=>{
    let user_id = req.body.user_id
    uploadFile(req,res,(err)=>{
        if(err || !req.file ){
            return res.json({success:false,msg:"No file recieved"})
        }else{
            let file = {
                name: req.file.filename.split('_').pop(0).toString(""),
                size: req.file.size,
                path: fileBasePath + req.file.filename,
                type: req.file.filename.split('.').pop(),
            }
            User.addFile(user_id,file,(err,user)=>{
                if (err || !user ){
                    log(err)
                    res.json({success:false, msg:"File not added"})
                }
                else
                    res.json({file:file,success:true, msg:"File added"})
            })
        }
    })
})

router.get('/:filename',(req,res,next)=>{
    let filename = req.params.filename;
    filepath = path.resolve( __dirname + "/../" + fileBasePath+filename )
    
    res.download(filepath,(err)=>{
        if(err)
            console.log({success:false,msg:err})
        else
            console.log({success:true,msg:"File downloaded"})
    });
})

router.delete('/:filename',(req,res,next)=>{
    let filename = req.params.filename;
    filepath = path.resolve( __dirname + "/../" + fileBasePath+filename )

    fs.unlink(filepath,(err)=>{
        if(err){
            console.log(err)
        }
        User.removeFile(fileBasePath+filename,(err,user)=>{
            if(err){
                console.log("Error ", err)
                res.json({success:false,msg:"Deletion from user failed"})
            }
            else if(user){
                res.json({success:true,msg:"Deletion successfull"})
            }
            else
                res.json({success:false,msg:"No user found"})
        })   
    })
})


module.exports = router;