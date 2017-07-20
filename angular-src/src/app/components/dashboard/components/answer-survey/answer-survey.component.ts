import { Output, EventEmitter, Input ,Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import * as Survey from 'survey-angular';

declare var JQuery : any;

var surveyJSON = {}

var datadata = "data"

@Component({
  selector: 'survey-display',
  template: `<div id='surveyElement'></div><div id='surveyAnswer'></div>`,
})
export class AnswerSurveyComponent  {

  @Input() json : any;
  @Input() data : {
    survey_id: any,
    submitter_id:any,
    answers:any[]
  };
  @Input() preview : boolean = true;

  constructor(
    private surveysService : SurveysService,
  ){

  }

  ngOnInit() {
    Survey.Survey.cssType = "bootstrap";
    this.loadSurvey(surveyJSON);
  }

  ngOnChanges(){
    this.loadSurvey(this.json);
  }

  sendDataToServer(survey) {
    datadata = survey.data;
    console.log(survey)
    localStorage.setItem('survey', JSON.stringify(survey.data));

    
  //this.surveysService.submitSurveyAnswers(this.data);
    var resultAsString = JSON.stringify(survey.data);
    console.log(resultAsString); //send Ajax request to your web server.
  }

  loadSurvey(survey){
      const surveyModel = new Survey.ReactSurveyModel(survey);

      
      surveyModel.onComplete.add(function (sender) {
        console.log(sender);
        saveData("");

        var mySurvey = sender;
        var surveyData = sender.data;
      });
      Survey.SurveyNG.render('surveyElement', { model: surveyModel });
  }
  
}

function saveData(data){
  datadata = JSON.parse(localStorage.getItem("survey"));
  $("#surveyAnswer").html(localStorage.getItem("survey"));
  console.log(datadata);
}
