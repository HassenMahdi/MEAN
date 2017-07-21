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

            Team.getTeamById(team_id,(err,team)=>{
            if(err){
                throw err;
            }if (team.team_members.indexOf(member_id)>-1) {
                res.json({success:false,msg:"Member already exists"+err})
            }else{
                Team.addTeamMember(team_id,member_id,leader,(err,team)=>{
                    if(err){
                         res.json({success:false,msg:"Member not added"+err});}
                    else{
                        if(team){
                            User.addTeam(member_id, team_id, leader, (err,user)=>{
                                res.json({user:user,team:team,success:true,msg:"Member "+user.username+" added to team "+team.team_name});
                            })}
                        else
                    res.json({success:false,msg:"Could not add team member"});
            }
                
                })

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
    Team.getTeamById(req.params.id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to get team"})
            throw err;
        }
        if (!team){
                res.json({success: false , msg : "failed to get team"})
        }else{
            //removing members
                for (member_id of team.team_members){
                        User.removeTeam(member_id, req.params.id,(err,user)=>{
                            if(user){
                                console.log('Member deleted');
                            }
                            })
                        }
            //removing leaders
                for (leader_id of team.team_leaders){
                        User.removeTeam(leader_id, req.params.id,(err,user)=>{
                            if(user){
                                console.log('leader deleted');
                            }
                            })
                        }                                     
        }
    }); 
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

//delete all team members (Can be useful)
router.delete('/members/all', (req,res,next)=>{
    let team_id = req.body.team_id;
    if ( !team_id ){
        res.json({success:false,msg:"null values for team id"});
        return;
    }
    Team.getTeamById(team_id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to get team"})
            throw err;
        }
        if (!team){
                res.json({success: false , msg : "failed to get team"})
        }else{
                for (member_id of team.team_members){
                        User.removeTeam(member_id, team_id,(err,user)=>{
                            if(user){
                                console.log('Member deleted');
                            }
                            })
                        }            
        }
    });        
    Team.removeAllTeamMembers(team_id,(err,team)=>{
        if(err)
            res.json({success:false,msg:"Members not deleted"+err});
        else
            res.json({team : team , success:true,msg:"All members successfully removed from team"});

    })
})


//delete all team leaders (Can be useful)
router.delete('/leaders/all', (req,res,next)=>{
    let team_id = req.body.team_id;
    if ( !team_id ){
        res.json({success:false,msg:"null values for team id"});
        return;
    }
    Team.getTeamById(team_id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed to get team"})
            throw err;
        }
        if (!team){
                res.json({success: false , msg : "failed to get team"})
        }else{
                for (leader_id of team.team_leaders){
                        User.removeTeam(leader_id, team_id,(err,user)=>{
                            if(user){
                                console.log('leader deleted');
                            }
                            })
                        }            
        }
    });        
    Team.removeAllTeamLeaders(team_id,(err,team)=>{
        if(err)
            res.json({success:false,msg:"Leaders not deleted"+err});
        else
            res.json({team : team , success:true,msg:"All leaders successfully removed from team"});

    })
})

//Transfer member to leader of a team

router.post('/graduate',(req,res,next)=>{
    let member_id = req.body.member_id;
    let team_id = req.body.team_id;

    if ( !member_id || !team_id ){
        res.json({success:false,msg:"null values for member id or team id"});
        return;
    }

    Team.graduateMemberToLeader(member_id,team_id,(err,team)=>{
        if(err){
            res.json({success: false , msg : "failed update team"});
        }
        else{
            User.graduateMember(member_id, team_id,(err,user)=>{
                    res.json({user:user,team:team,success:true,msg:"Updated"});
                })
            }})
            
        }
);

module.exports = router;