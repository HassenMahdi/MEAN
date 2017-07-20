import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey-question-sr',
  templateUrl: './survey-question-sr.component.html',
  styleUrls: ['./survey-question-sr.component.css']
})
export class SurveyQuestionSrComponent implements OnInit {

   questionData = {
    question_number: 0,
    question_text: null
  }
  
  constructor() { }

  ngOnInit() {
  }

}
