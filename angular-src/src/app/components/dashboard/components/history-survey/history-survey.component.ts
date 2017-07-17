import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';


@Component({
  selector: 'app-history-survey',
  templateUrl: './history-survey.component.html',
  styleUrls: ['./history-survey.component.css']
})
export class HistorySurveyComponent implements OnInit {

  constructor(
    private surveysService : SurveysService,
  ) { }

  surveys:any;


  ngOnInit() {
      //console.log('debug1');
      this.surveysService.getSurveys().subscribe( survey => {
          this.surveys = survey;
          console.log(survey);
        },
        err=>{
          console.log(err);
          return false;
        });

  }

}
