import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../../../services/surveys.service';
import { AuthService } from '../../../../services/auth.service';
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
    private authServic : AuthService,
  ) { }

  ngOnInit() {

    this.user_id = JSON.parse(localStorage.getItem('user'))._id;
    
    this.teamsList=[];

    this.authServic.getProfile().subscribe(profile =>{
      if(profile.user)
      {
        this.user = profile.user;

        this.user.teams.forEach(element => {
          if (element.team){
            this.teamsList.push(element.team._id)
          }
        });

        console.log(this.teamsList);

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
      else{
        this.toastr.error("No user found","Error")
      }
    },
    err=>{
      this.toastr.error(err, "Failed to connect")
      console.log(err)
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
