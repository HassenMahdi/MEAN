const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const SchemaTypes = mongoose.Schema.Types;

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  teams:[
    { 
      team :{ type: SchemaTypes.ObjectId , ref : 'Team' },
      leader: { type: Boolean , default : false }
    } 
   ],
  regtoken: [
    {
      type: String,
      unique : true,
    }
  ]

});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addTeam = function(user_id,team_id,leader = false,callback){
  User.findOneAndUpdate({_id:user_id},{$push:{teams:{
    team: team_id,
    leader:leader,
  }}},callback)
}

module.exports.removeTeam = function(user_id,team_id,callback){
  User.findOneAndUpdate({_id:user_id},{$pull:{teams:{
    team: team_id,
  }}},callback)
}

module.exports.getUserById = function(id, callback){
  User.findById(id).populate('teams.team').exec(callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err , isMatch)=>{
    if (err) throw err;
    callback(null, isMatch);
  });

} 

module.exports.graduateMember = function(user_id,team_id,callback){
  User.findOneAndUpdate({_id:user_id}, {$pull:{teams:{team: team_id}}},callback)
}

module.exports.addRegToken = function (id, token, callback){
  User.findByIdAndUpdate({_id:id},{$addToSet:{regtoken:token}},callback)
}

module.exports.getUserTokens = function(user_id,callback){
  User.findOne({_id:id},'regtoken',callback)
}