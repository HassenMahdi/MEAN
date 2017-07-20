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

    team_members: [{type: ShemaTypes.ObjectId , ref:'User'}]
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
