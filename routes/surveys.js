const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');
const Team = require('../models/team');
const config = require('../config/database');
const notify = require('../push_notifications/notify');

router.post('/add',(req,res,next)=>{
    let newSurvey = new Survey({
        team_id : req.body.team_id,
        owner_id : req.body.owner_id,
        name : req.body.name,
        subject : req.body.subject,
        begindate : req.body.begindate,
        enddate : req.body.enddate,
        questions : req.body.questions
    })

    Survey.addSurvey(newSurvey,(err, survey)=>{
        if(err){
            res.json({success: false, msg:'Failed to add survey: '+err});
        } else {
            res.json({success: true, msg:'Survey added'});
            Team.getTeamTokens(newSurvey.team_id,(err,tokens)=>{
                if( !err && tokens ){
                    notify.sendNotifById(tokens,{
                        notification:{
                            title:"A new survey is added",
                            body:"Click here to go answer it",
                        }
                    })
                }
            })
        }
    })
})

//add Survey submission
router.post('/add/answers',(req,res,next) =>{
    let sub = {
        submitter_id : req.body.submitter_id,
        answers : req.body.answers
    }
    let survey_id = req.body.survey_id;

    Survey.addSurveySubmission(survey_id,sub,(err, survey)=>{
        if(err){
            res.json({success: false, msg:'Failed to add survey submission: '+err});
        } else {
            if (survey){
                res.json({survey : survey , success: true, msg:'Survey added'});
            }
            else
                res.json({success: false, msg:'Survey does not exist'});
        }
    })
});

//Get all surveys
router.route('/get')

	.get(function(req, res){
		Survey.find(function(err, surveys){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,surveys);
		});
	});

//Get survey by ID
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

//Get survey by the owner ID
router.get('/get/owner/:id',(req,res,next)=>{
 
    Survey.getSurveyByOwnerId(
        req.params.id,
        (err, surveys)=>{
            if (err) throw err;
            else {
            if (surveys)
                res.json({surveys:surveys,success:true, msg:"Surveys found"});
            else
                res.json({success:false, msg:"No surveys found"});
            }
        }
    )

});

//get surveys by team id list
router.get('/get/teams/:id_list',(req,res,next)=>{
    let teams_list = req.params.id_list.split(',');

    Survey.getSurveysByTeamIdList(teams_list,(err,surveys)=>{
        if(err){
            return res.json({success:false,msg:"Bad request"})
        }else{
            if(surveys){
                return res.json({surveys:surveys,success:true,msg:"Surveys extracted"})
            }else{
                return res.json({success:false,msg:"Could not find any survey"})
            }
        }
    })
    
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