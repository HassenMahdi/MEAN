const mongoose = require('mongoose');
const config = require('../config/database');
const ShemaTypes = mongoose.Schema.Types;

const TeamSchema = mongoose.Schema({
     
    team_name:  {
        type: String,
        required: true
      },

    team_info: String,

    creation_date: { type: Date, default: Date.now },

    team_leaders: {type: [{type: ShemaTypes.ObjectId , ref:'User'} ], required: true},

    team_members: [{type: ShemaTypes.ObjectId , ref:'User'}],

    messages : [ {
        text : String,
        username : String,
        date : { type: Date, default: Date.now },
    } ]
});

const Team = module.exports = mongoose.model('Team', TeamSchema);

module.exports.addTeam = function(team,callback){
    team.save(callback);
};

module.exports.addTeamMember = function(team_id, member_id, leader,callback){
    if (leader)
        Team.findOneAndUpdate({_id :  team_id} , {$push:{team_leaders:member_id}},callback);
    else
        Team.findOneAndUpdate({_id :  team_id} , {$push:{team_members:member_id}},callback);
}

//Remove team member
module.exports.removeTeamMember = function(team_id , member_id,callback){
    Team.findOneAndUpdate({_id :  team_id} , {$pull:{team_members:member_id}},callback);
}

//Remove all team members
module.exports.removeAllTeamMembers = function(team_id,callback){
    Team.findOneAndUpdate({_id :  team_id} , {team_members:[]},callback);
}

//Remove all team leaders
module.exports.removeAllTeamLeaders = function(team_id,callback){
    Team.findOneAndUpdate({_id :  team_id} , {team_leaders:[]},callback);
}

//Remove Team Leader
module.exports.removeTeamLeader = function(team_id, leader_id, callback){
    Team.findOneAndUpdate({_id :  team_id} , {$pull:{team_leaders:leader_id}},callback);
}

module.exports.getTeamById = function (team_id,callback){
    const query = { _id : team_id };
    Team.findOne(query).populate('team_members').populate('team_leaders').exec(callback);
}

module.exports.getTeamByName = function (team_name,callback){
    const query = { name : team_name };
    Team.findOne(query).populate('team_members').populate('team_leaders').exec(callback);
}

//transfer member to leader
module.exports.graduateMemberToLeader = function (member_id,team_id,callback){
    Team.findOneAndUpdate({_id:team_id},{$pull:{team_members:member_id}},(err,res)=>{
        if (err){throw err}else{
            Team.findOneAndUpdate({_id:res._id},{$push:{team_leaders:member_id}},callback);        
    }});    
}

module.exports.getTeamTokens = function(team_id,callback){
    Team.find({_id:team_id}).populate('team_leaders','regtoken').populate('team_members','regtoken').exec((err,teams)=>{
        if (err){
            callback(err,null)
        }else{
            if(teams){
                let res= []
                teams.forEach(function(team) {
                    team.team_leaders.forEach(function(element) {
                        res = res.concat(element.regtoken)
                    }, this);
                    team.team_members.forEach(function(element) {
                        res = res.concat(element.regtoken)
                    }, this);
                        
                }, this);
                callback(null,res)
            }else{
                callback(null,null)
            }
        }
    })
}

module.exports.addMessage = function(team_id,message,callback){
    Team.findOneAndUpdate({ _id: team_id },{ $push:{ messages:message }},callback)
}

//Update Team 
module.exports.editTeam = function(team_id,new_team_name,new_team_info,callback){
    Team.findOneAndUpdate({_id : team_id} , {team_name : new_team_name, team_info : new_team_info},callback);
}

