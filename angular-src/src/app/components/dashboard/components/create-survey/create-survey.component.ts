import { Component, OnInit } from '@angular/core';
import { SurveyQuestionQaComponent } from './dynamic-survey/survey-question-qa/survey-question-qa.component';  
import { SurveyQuestionSrComponent } from './dynamic-survey/survey-question-sr/survey-question-sr.component';
import {IMyDpOptions} from 'mydatepicker';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'toastr-ng2';
import { SurveysService } from '../../../../services/surveys.service';



@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})


export class CreateSurveyComponent implements OnInit {

  invalideMsg : String[] = [];

  componentData = [];

  questions : any;

  user: any;

  //Survey Information
  name: String[];
  desc: String[];
  target_team_id = "" ;

  private beginDatePicker: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
  };
  
  

  private endDatePicker: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
  };

  currentDate = new Date();
  tommorowDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);

  private endDate =  { 
    date: { 
      day : this.tommorowDate.getDate(),
      month : this.tommorowDate.getMonth(),
      year : this.tommorowDate.getFullYear()
    }
  };
  private beginDate =  { 
    date: { 
      day : this.currentDate.getDate(),
      month : this.currentDate.getMonth(),
      year : this.currentDate.getFullYear()
    }
  };
  constructor(
    private authService : AuthService,
    private toasrt : ToastrService,
    private surveysService : SurveysService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
      this.user = profile.user;

      console.log(this.user);
      
    },
    err=>{
      console.log(err);
      return false;
    })


  }

  deleteSurveyQuestion(e:Event,index){
    e.preventDefault();
    this.questions.splice(index,1)
  }

  

  submitSurvey(){

    this.invalideMsg = [];

    if ( this.name == null )
      this.invalideMsg.push("Insert a valid name.");

    if ( this.validDates(this.beginDate, this.endDate) )
      this.invalideMsg.push("Please enter valid dates.");

    if ( this.target_team_id == "" )
      this.invalideMsg.push("Select a team.");

    if ( this.questions == null )
      this.invalideMsg.push("Save your changes before submitting.");
    
    if (this.invalideMsg.length<=0){

      let survey = {
        team_id: this.target_team_id,
        owner_id: this.user._id,
        name : this.name,
        subject : this.desc,
        begindate: new Date(
          this.beginDate.date.year,
          this.beginDate.date.month,
          this.beginDate.date.day,
        ),
        enddate: new Date(
          this.endDate.date.year,
          this.endDate.date.month,
          this.endDate.date.day,
        ),
        questions: this.questions
      }

      this.surveysService.CreateSurvey(survey).subscribe(
        res=>{
          console.log(res)
          if(res.success)
            this.toasrt.success("Your team members will be notified","Great!");
          else
            this.toasrt.error("Something went wrong.","Oops!");  
      },     
        err=>{
          this.toasrt.error("Something went wrong.","Oops!");
      });
      
    }
  }

  printDate(){
    console.log(this.endDate);
  }

  validDates(beginDate, endDate){
    var bd = new Date(
      beginDate.date.year,
      beginDate.date.month,
      beginDate.date.day,
    );
    var ed = new Date(
      endDate.date.year,
      endDate.date.month,
      endDate.date.day,
    ); 

    if ( ed > bd )
      return false
    else 
      return true;

  }

  json: any

    onSurveySaved(survey) {
      this.questions = survey;
    }
}
