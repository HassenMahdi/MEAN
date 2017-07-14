const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');
const config = require('../config/database');

router.post('/add',(req,res,next)=>{
    let newSurvey = new Survey({
        owner_id : req.body.owner_id,
        name : req.body.name,
        subject : req.body.name,
        begindate : req.body.begindate,
        enddate : req.body.enddate,
        questions : req.body.questions
    })

    Survey.addSurvey(newSurvey,(err, survey)=>{
        if(err){
            res.json({success: false, msg:'Failed to add survey: '+err});
        } else {
            res.json({success: true, msg:'Survey added'});
        }
    })
})

router.get('/get/:id',(req,res,next)=>{
 
    Survey.getSurveyById(
        req.params.id,
        (err, survey)=>{
            if (err) throw err;
            else {
                res.json(survey);
            }
        }
    )

})

router.get('/get/owner/:id',(req,res,next)=>{
 
    Survey.getSurvey(
        req.params.id,
        (err, survey)=>{
            if (err) throw err;
            else {
                res.json(survey);
            }
        }
    )

})

router.get('/get/date/:id/:date',(req,res,next)=>{
 
    Survey.getSurveyByDate(
        req.params.id,req.params.date,
        (err, survey)=>{
            if (err) throw err;
            else {
                res.json(survey);
            }
        }
    )

})

router.post('/submit',(req,res,next)=>{
    let submission = {
        submitter_id: req.body.submitter_id,
        answers: req.body.answers
    }

    let survey_id = req.body.survey_id;

    Survey.addSurveySub(survey_id,submission,(err,sub)=>{
        if (err){
            res.json({success:false, msg:"Submission not accomplished"});
            throw err;
        }
        else{
            res.json({submission,success:true, msg:"Submission successful"});
        }

    })
})

module.exports = router;