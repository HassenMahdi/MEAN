import { Output, EventEmitter, Input ,Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import * as Survey from 'survey-angular';

declare var JQuery : any;

var surveyJSON = {}

@Component({
  selector: 'survey-display',
  template: `<div id='surveyElement'></div>`,
})
export class AnswerSurveyComponent  {

  @Input() json : any;

  @Input() preview : boolean = true;

  @Output() surveySaved: EventEmitter<Object> = new EventEmitter();

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

  loadSurvey(survey){
      const surveyModel = new Survey.ReactSurveyModel(survey);
      surveyModel.onComplete.add(this.saveMySurvey);
      Survey.SurveyNG.render('surveyElement', { model: surveyModel });
  }

  saveMySurvey = (survey) => {
        this.surveySaved.emit(survey.data);
    }
  
}
 
