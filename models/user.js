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
  image:{ type:String, default:"assets/images/profile.png" },
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
    },
  ],
  logs : [{
    type: String,
    required: true,
  }],
  files : [ {
    type: SchemaTypes.Mixed,
  }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addTeam = function(user_id,team_id,leader,callback){
  User.findOneAndUpdate({_id:user_id},{$push:{teams:{
    team: team_id,
    leader:leader,
  }}},callback)
}

module.exports.addManyToTeam = function(team_members,leader,team_id,callback){
  User.updateMany({_id:{$in:team_members}},{$push:{teams:{
    team: team_id,
    leader:leader,
  }}},callback)
}

module.exports.removeTeam = function(user_id_list,team_id,callback){
  User.findOneAndUpdate({_id:{$in:user_id_list}},{$pull:{teams:{
    team: team_id,
  }}},callback)
}

module.exports.getUserById = function(id, callback){
  date = new Date()
  date = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
  User.findOneAndUpdate({_id:id},{$addToSet:{logs:date}}).populate('teams.team').exec(callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.getUsersByUsernames = function(usernames_list, callback){
  const query = {username: {$in:usernames_list}}
  User.find(query, callback);
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
  User.findOneAndUpdate({_id:user_id}, {$pull:{teams:{team: team_id}}},(err,res)=>{
        if (err){throw err}else{
            User.findOneAndUpdate({_id:res._id},{$push:{teams:{
    team: team_id,
    leader:true,
  }}},callback);        
    }});  
}

module.exports.addRegToken = function (id, token, callback){
  User.findByIdAndUpdate({_id:id},{$addToSet:{regtoken:token}},callback)
}

module.exports.getUserTokens = function(user_id,callback){
  User.findOne({_id:id},'regtoken',callback)
}

module.exports.changePassword = function(user_id,newpass,callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newpass, salt, (err, hash) => {
      if(err) throw err;
      newpass = hash;
      User.findOneAndUpdate({_id:user_id},{password:newpass},callback)
    });
  });
}

module.exports.changeImage = function(id,url,callback){
  User.findOneAndUpdate({_id:id},{image:url},callback)
}

module.exports.findQuery = function(query,callback){
  User.find(query,callback)
}

module.exports.addFile = function(user_id,file,callback){
  User.findOneAndUpdate({_id:user_id},{$push:{files:file}},callback)
}

module.exports.removeFile = function(filepath,callback){
  User.findOneAndUpdate({files:{$elemMatch:{ path:filepath } } },{$pull:{files:{ path:filepath } } },callback)
}