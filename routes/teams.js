const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const User = require('../models/user');
const config = require('../config/database');

//create a new team
router.post('/create',(req,res,next)=>{
    let team = new Team( {
        team_name : req.body.team_name,
        team_info : req.body.team_info,
        team_leaders : [req.body.user_id]
    })

    Team.addTeam(team,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to create team"});
            throw err;
        }
        if(team){
            User.addTeam(req.body.user_id, team._id,true,(err,user)=>{
                if (err)
                    res.json({team : team , success: true , msg : "failed to create team"});
                if(user)
                    res.json({team : team , success: true , msg : "Successfully created a new team"});
            })
            
        }
    });
})

//get the team by team id
router.get('/get',(req,res,next)=>{
    res.json({canget:"yes"})
})

//get the team by team id
router.get('/get/:id',(req,res,next)=>{
    Team.getTeamById(req.params.id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to get team"})
            throw err;
        }
        if (!team){
                res.json({success: false , msg : "failed to get team"})
        }else{
            res.json({team : team , success: true , msg : "Team extraction successfull"});
        }
    });
})


//add team member (set leader to true to add a leader)
router.post('/members',(req,res,next)=>{
    let member_id = req.body.member_id;
    let team_id = req.body.team_id;
    let leader = req.body.leader
    
    if ( !member_id || !team_id ){
        res.json({success:false,msg:"null values for member id or team id"});
        return;
    }
    
    Team.addTeamMember(team_id,member_id,leader,(err,team)=>{
        if(err)
            res.json({success:false,msg:"Member not added"+err});
        else{
            if(team)
                User.addTeam(member_id, team_id, leader, (err,user)=>{
                    res.json({user:user,team:team,success:true,msg:"Member "+user.username+" added to team "+team.team_name});
                })
            else
                res.json({success:false,msg:"Could not add team member"});
        }
            
    })
})

//delete team member
router.delete('/members',(req,res,next)=>{
    let member_id = req.body.member_id;
    let team_id = req.body.team_id;
    if ( !member_id || !team_id ){
        res.json({success:false,msg:"null values for member id or team id"});
        return;
    }
        
    Team.removeTeamMember(team_id,member_id,(err,team)=>{
        if(err)
            res.json({success:false,msg:"Member not deleted"+err});
        else
            User.removeTeam(member_id, team_id,(err,user)=>{
                    res.json({user:user,team:team,success:true,msg:"Member deleted"});
                })
    })
})

//delete team leader
router.delete('/leaders',(req,res,next)=>{
    let leader_id = req.body.leader_id;
    let team_id = req.body.team_id;
    if ( !leader_id || !team_id ){
        res.json({success:false,msg:"null values for leader id or team id"});
        return;
    }
        
    Team.removeTeamLeader(team_id,leader_id,(err,team)=>{
        if(err)
            res.json({success:false,msg:"Leader not deleted"+err});
        else
            User.removeTeam(leader_id, team_id,(err,user)=>{
                    res.json({user:user,team:team,success:true,msg:"Leader deleted"});
                })
    })
})

//delete team from database
router.delete('/:id', function(req,res,next){
    Team.findByIdAndRemove(req.params.id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to get team"})
            throw err;
        }
        if (!team){
                res.json({success: false , msg : "failed to get team"})
        }else{
            res.json({team : team , success: true , msg : "Team removed successfully"});
        }
    })
})

module.exports = router;