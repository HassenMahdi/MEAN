import { Input, Component, OnInit } from '@angular/core';


@Component({
  selector: 'dynamic-survey',
  templateUrl: './dynamic-survey.component.html',
  styleUrls: ['./dynamic-survey.component.css']
})

export class DynamicSurveyComponent implements OnInit {

  @Input() questions = [];

  constructor() {
  
  }

  ngOnInit() {
  
  }

  deleteSurveyQuestion(e:Event,i){

    e.preventDefault();

    this.questions.splice(i,1);

  }

  addSurveyQuestion(e:Event,type:String){

    e.preventDefault();

    switch(type){
      case "qa":
        this.questions.push({
          content: "",
          type: "qa",
          typeFull:"Question/Answer"
        });
        console.log("type1");
        break;
      case "sr":
        this.questions.push({
          content: "",
          type: "sr",
          typeFull:"Star Rating"
        });
        break;
        case "po":
        this.questions.push({
          content: "",
          type: "po",
          typeFull:"Poll",
          bchoice : true,
          choices:["choice 1","choice 2"]
        });
        break;
        case "mc":
        this.questions.push({
          content: "",
          type: "mc",
          typeFull:"Multiple choise",
          bchoice : true,
          choices:["choice 1","choice 2"]
        });
        break;
        
      default: console.log("Unknowen type");

    }
  }

}

