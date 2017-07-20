import { Input ,Component, OnInit } from '@angular/core';

import * as Survey from 'survey-angular';

var surveyJSON = { title: "Tell us, what technologies do you use?", pages: [
  { name:"page1", elements: [ 
      { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
      { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visibleIf: "{frameworkUsing} = 'Yes'" }
   ]},
  { name: "page2", elements: [
    { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
    { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visibleIf: "{mvvmUsing} = 'Yes'" } ] },
  { name: "page3",elements: [
    { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
 ] 
}

@Component({
  selector: 'survey-display',
  template: `<div id='surveyElement'></div>`,
})
export class AnswerSurveyComponent  {

  @Input() json : any;
  @Input() preview : boolean = true;

  ngOnInit() {
    Survey.Survey.cssType = "bootstrap";
    loadSurvey(surveyJSON);
  }

  ngOnChanges(){
    console.log(this.json)
    console.log(surveyJSON)
    loadSurvey(this.json);
  }
  
}

function sendDataToServer(survey) {
  var resultAsString = JSON.stringify(survey.data);
  alert(resultAsString); //send Ajax request to your web server.
}

function loadSurvey(survey){
      const surveyModel = new Survey.ReactSurveyModel(survey);
      surveyModel.onComplete.add(sendDataToServer);
      Survey.SurveyNG.render('surveyElement', { model: surveyModel });
}
