import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import { AuthService } from '../../../../services/auth.service';

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
  ) { }

  surveys:any[];
  survey: any;
  questions:any;


  ngOnInit() {

      this.surveysService.getOwnedSurveys( JSON.parse(localStorage.getItem('user'))._id ).subscribe( survey => {
          this.surveys = survey;
          this.formatSurveys(this.surveys);
          console.log(this.surveys);
        },
        err=>{
          console.log(err);
          return false;
        });

  }
      
  selectSurvey(e:Event,index){
    e.preventDefault();
    this.survey = this.surveys[index];
    this.questions = this.survey.questions[0];
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

  filterSurveysByStatus(surveys:any[], getActive: Boolean){
    if (surveys == null ) return;
    surveys.forEach((element,index) => {
      if (new Date(element.enddate) >= new Date())
      {
        element.active = true;
        if (!getActive)
          surveys.splice(index,1);
      }
      else{ 
        element.active = "false"
        if (getActive)
          surveys.splice(index,1);
      }
    });
  }

}

