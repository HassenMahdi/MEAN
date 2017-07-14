const mongoose = require('mongoose');
const config = require('../config/database');
const ShemaTypes = mongoose.Schema.Types;

const SurveySchema = mongoose.Schema({
     
    owner_id: {type:ShemaTypes.ObjectId , ref:'User'},

    name: String,
    
    subject: String,
    
    begindate: Date,
    enddate: Date,
    
    questions:[
        {
            num: Number,
            content: String,
            model: String,
        }
    ],
    submissions:[
        {
            submitter_id: { type:ShemaTypes.ObjectId, ref : 'User'},
            answers:[
                {
                    question_num: Number,
                    content: String,
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
    Survey.find(query).populate('owner_id').exec(callback);
}

module.exports.getSurveyById = function (survey_id,callback){
    const query = { _id : survey_id };
    Survey.findOne(query).populate('owner_id').exec(callback);
}

module.exports.getSurveyByDate = function(owner_id,date,callback){
    const query = { owner_id : owner_id , begindate : date };
    Survey.find(query).populate('owner_id').exec(callback);;
}

module.exports.addSurveySub = function(survey_id,submission,callback){
    Survey.findByIdAndUpdate(
        {_id:survey_id},
        {$push:{submissions:submission}},
        callback);
}