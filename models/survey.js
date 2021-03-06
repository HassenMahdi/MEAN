const mongoose = require('mongoose');
const config = require('../config/database');
const ShemaTypes = mongoose.Schema.Types;

const SurveySchema = mongoose.Schema({
     
    team_id: {type:[{type:ShemaTypes.ObjectId , ref:'Team'}], required: true },

    owner_id: {type:ShemaTypes.ObjectId , ref:'User' , required: true},

    name: {
        type:String,
        required: true
    },
    
    subject: String,
    
    begindate: {
        type:Date,
        required: true
    },
    enddate: {
        type:Date,
        required: true
    },
    
    questions:[
        {
            type: ShemaTypes.Mixed,
        }
    ],
    submissions:[
        {
            submitter_id: { type:ShemaTypes.ObjectId, ref : 'User'},
            answers:[
                {
                    type: ShemaTypes.Mixed,
                }
            ]
        }
    ]
});

const Survey = module.exports = mongoose.model('Survey', SurveySchema);

module.exports.addSurvey = function(survey,callback){
    survey.save(callback);
};


module.exports.getSurvey = function (owner_id,callback){
    const query = { owner_id : owner_id };
    Survey.find(query)
        .populate('owner_id')
        .populate('team_id')
        .populate('submissions')
        .exec(callback);
}

module.exports.getSurveyById = function (survey_id,callback){
    const query = { _id : survey_id };
    Survey.findOne(query)
        .populate('owner_id')
        .populate('team_id')
        .populate('submissions')
        .exec(callback);
}

module.exports.getSurveyByOwnerId = function (owner_id,callback){
    const query = { owner_id : owner_id };
    Survey.find(query)
        .populate('owner_id')
        .populate('team_id')
        .populate('submissions.submitter_id','username name')
        .exec(callback);
}

module.exports.getSurveyByDate = function(owner_id,date,callback){
    const query = { owner_id : owner_id , begindate : date };
    Survey.find(query).populate('owner_id')
        .populate('owner_id')
        .populate('team_id')
        .populate('submitter_id')
        .exec(callback);
}

module.exports.getSurveysByTeamIdList = function (team_id_list,callback){
    const query = { team_id : { $in : team_id_list }} ;
    Survey.find(query).exec(callback);
}

module.exports.addSurveySub = function(survey_id,sub,callback){
    Survey.findOneAndUpdate({ _id : survey_id },{ $push:{ submissions: sub} } , callback );
};

module.exports.deleteById = function(id, callback){
    Survey.findByIdAndRemove({_id:id},callback);
}

module.exports.findActive = function(team_list,currentdate,callback){
    Survey.find({'team_id':{$in : team_list }},'name subject team_id owner_id begindate enddate')
        .populate('team_id','team_name')
        .populate('owner_id','name username')
        .exec(callback)
}

var populateSurvey = function(){
}