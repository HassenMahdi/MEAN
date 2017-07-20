import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey-question-qa',
  templateUrl: './survey-question-qa.component.html',
  styleUrls: ['./survey-question-qa.component.css']
})
export class SurveyQuestionQaComponent implements OnInit {

  questionData = {
    question_number: 0,
    question_text: null
  }
  
  constructor() { }

  ngOnInit() {
  }

}
