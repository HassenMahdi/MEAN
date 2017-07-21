import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import { ToastrService } from 'toastr-ng2'



@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})


export class TakeSurveyComponent implements OnInit {

  preview = false;
  data : any;

  surveys:any[];
  displayesurveys:any[];
  survey:any;
  questions:any[];

  user_id :any;
  user :any;
  teamsList : any[];

  constructor( 
    private surveysService : SurveysService,
    private toastr : ToastrService,
  ) { }

  ngOnInit() {

    this.user_id = JSON.parse(localStorage.getItem('user'))._id;

    this.user =  JSON.parse(localStorage.getItem('user'));
    
    this.teamsList=[];

    this.user.teams.forEach(element => {
      if (element.team){
        this.teamsList.push(element.team)
      }
    });

    this.surveysService.getTeamsSurvey( this.teamsList ).subscribe( res => {
          if( res.success)
          {
            this.surveys = res.surveys;
            this.displayesurveys = this.surveysService.filterSurveysByStatus(this.surveys,true);
            this.surveysService.formatSurveys(this.displayesurveys);
          }else{
            this.toastr.info(res.msg);
          }
        },
        err=>{
          console.log(err);
          return false;
        });
  }

  onSurveySubmitted(answers){
    console.log(this.survey._id)
    this.surveysService.submitSurveyAnswers(this.survey._id,this.user_id,answers)
      .subscribe(
        res=>{
          if (res.success) 
            this.toastr.success("Your answers have been submitted","Success");
          else
            this.toastr.error(res.msg,"Error");
        },
      err=>{
              console.log(err);
              return false;
        })
  }

  selectSurvey(e:Event,index){
    e.preventDefault();
    this.survey = this.displayesurveys[index];
    this.questions = this.survey.questions[0];
    }

}
