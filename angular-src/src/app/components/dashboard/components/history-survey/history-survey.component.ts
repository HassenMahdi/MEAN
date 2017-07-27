import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'toastr-ng2';

declare var dateFormat : any;


@Component({
  selector: 'app-history-survey',
  templateUrl: './history-survey.component.html',
  styleUrls: ['./history-survey.component.css']
})
export class HistorySurveyComponent implements OnInit {

  user : any ;

  constructor(
    private surveysService : SurveysService,
    private authService : AuthService,
    private toastr : ToastrService
  ) { }

  surveys:any[];
  survey: any;
  questions:any;
  qList:any;
  subs:any[];
  answers:any[];
  answersTable:any[];


  ngOnInit() {

      this.surveysService.getOwnedSurveys( JSON.parse(localStorage.getItem('user'))._id ).subscribe( res => {
        if (res.success)
        {
          this.surveys = res.surveys;
          this.formatSurveys(this.surveys);
        }else{
          this.toastr.info(res.msg);
          }
      },
      err=>{
        console.log("could not get surveys of memeber with id "+ JSON.parse(localStorage.getItem('user'))._id +  " : " + err);
        return false;
      });

  }
      
  selectSurvey(e:Event,index){
    e.preventDefault();
    this.survey = this.surveys[index];
    this.questions = this.survey.questions[0];
    this.subs = this.survey.submissions;
    this.answers = [];

    var res = this.surveysService.formatAnswersTable(this.questions,this.subs);
    this.qList = res.questions;
    this.answersTable = res.answers;

    }

  selectUserAnswer(index){
    var an = this.subs[index].answers
    this.answers =[]
    for (var key in an) {
      for( var key2 in an[key]){
        this.answers.push({
          q: key2,
          a: an[key][key2]
        })
      }
    }
  }

  formatSurveys(surveys:any[]){
    if (surveys == null ) return;
    surveys.forEach(element => {

      if (new Date(element.enddate) >= new Date())
      {
        element.active = true;
        element.activeclass= "activesurvey";
      }
      else{ 
        element.active = "false"
        element.activeclass= "inactivesurvey";
      }

      element.begindate = dateFormat(element.begindate, "dd/mm/yyyy");
      element.enddate = dateFormat(element.enddate, "dd/mm/yyyy");      
    });

  }

}

