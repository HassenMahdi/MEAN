import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';



@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})


export class TakeSurveyComponent implements OnInit {

  preview = false;
  data : any;

  surveys:any[];
  displayesurveys:any[];
  survey:any;
  questions:any[];

  user_id :any;

  constructor( 
    private surveysService : SurveysService
  ) { }

  ngOnInit() {

    this.user_id = JSON.parse(localStorage.getItem('user'))._id;

    this.surveysService.getOwnedSurveys( this.user_id ).subscribe( survey => {
          this.surveys = survey;
          this.displayesurveys = this.surveysService.filterSurveysByStatus(this.surveys,true);
          this.surveysService.formatSurveys(this.displayesurveys);
          console.log(this.surveys);
        },
        err=>{
          console.log(err);
          return false;
        });
  }

  selectSurvey(e:Event,index){
    e.preventDefault();
    this.survey = this.displayesurveys[index];
    this.questions = this.survey.questions[0];
    this.data = {
      survey_id : this.survey._id,
      submitter_id : this.user_id,
      answers :[]
    } ;

    }

}
