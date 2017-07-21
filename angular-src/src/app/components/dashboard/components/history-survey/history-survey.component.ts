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

  surveys:any;
  survey: any;
  questions:any;


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
    }

  formatSurveys(surveys){
    surveys.forEach(element => {
      element.begindate = dateFormat(element.begindate, "dd/mm/yyyy");
      element.enddate = dateFormat(element.enddate, "dd/mm/yyyy");
    });

  }

}

