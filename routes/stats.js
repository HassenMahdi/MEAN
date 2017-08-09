const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');
const Team = require('../models/team');
const User = require('../models/user');
const config = require('../config/database');

router.get('/',(req,res,next)=>{
    return res.json({success:false,msg:"Invalid request"})
})

router.get('/:team_list',(req,res,next)=>{
    getTeamsActivity(req,(list,dates,activemembers)=>{
        getSurveysInfo(req,(up_sur,act_sur)=>{
            res.json({
                activemembers:activemembers || [],
                upcoming_surveys:up_sur  || [],
                active_surveys:act_sur  || [],
                list:list,dates:dates  || [] 
            })
        })
    });
})

getPastWeekDates = function(){
    var dates = []
    var today = new Date()
    for (var i = 0 ; i<7 ; i++){
        d = new Date( today.getTime() + -i*24*60*60*1000 );
        dates.push( d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear())
    }
    return dates
}

getTeamsActivity = function(req,callback){

    var team_list = []
    team_list = req.params.team_list.split(',')
    let date = req.params.date

    let list = []

    User.findQuery({ "teams.team" : { $in : team_list }} , (err,users)=>{
        if(err || !users){
            callback(null,null,null)
        }
        else{

            dates = getPastWeekDates()

            team_list.forEach(function(team_id,it){

                var sublist = []

                var team_users = []

                team_users = users.filter((user)=>{
                    return user.teams.findIndex(team => (team.team == team_id))
                })

                console.log("-------------------------------")

                for (var d = 0 ; d < 7 ; d++){

                    var team_users_date = []

                    team_users_date = team_users.filter((user)=>{
                        if ( user.logs.indexOf(dates[d]) >= 0 )
                            return true;
                        else
                            return false;
                    })
                    
                    sublist.push(team_users_date.length)
                }

                list.push({
                    team:team_id,
                    stats:sublist,
                })

            }, this);

            var  activemembers = users.filter(user =>{
                if ( user.logs.indexOf(dates[0]) > -1 ) 
                    return true;
                else 
                    return false; 
            })

            return callback(list,dates,activemembers)
        }
    })

}

getSurveysInfo = function(req,callback){
    var team_list = []
    team_list = req.params.team_list.split(',')
    let currentdate = new Date()

    Survey.findActive(team_list,currentdate,(err,surveys)=>{
        if(err || !surveys) callback(null,null)
        else{
            var active_surveys = surveys.filter( survey =>{
                return (survey.enddate > currentdate && survey.begindate < currentdate ) 
            })
            var upcoming_surveys = surveys.filter( survey =>{
                return ( survey.begindate > currentdate )
            });
            console.log("active surveys: "+ active_surveys.length + "  Upcoming suveys: "+ upcoming_surveys.length)
            callback(upcoming_surveys,active_surveys)
        }
    })

}

module.exports = router;