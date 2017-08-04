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
  displayanswered:any[]
  survey:any;
  questions:any[];
  answers:any[];
  selectedAnswersIndex:any
  selectedSurveyIndex:any

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

        this.surveysService.getTeamsSurvey( this.teamsList ).subscribe( res => {
          if( res.success)
          {
            this.surveys = res.surveys;

            this.displayesurveys=[]
            this.displayanswered=[]
            
            this.surveys.forEach(element => {
              var index = element.submissions.findIndex( a => ( a.submitter_id == this.user._id ) )
              if ( index >= 0)
              {
                this.displayanswered.push(element);
              }else
              {
                this.displayesurveys.push(element);
              }
            });

            this.updateDisplayedSurveys()
            
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
    this.surveysService.submitSurveyAnswers(this.survey._id,this.user._id,answers)
      .subscribe(
        res=>{
          if (res.success){
            this.toastr.success("Your answers have been submitted","Success");
            
            
              this.displayesurveys[this.selectedSurveyIndex]
                .submissions.push({
                  submitter_id : this.user._id,
                  answers : answers,
                })

            this.displayanswered.push(
              this.displayesurveys[this.selectedSurveyIndex]
            )
            
            this.displayesurveys.splice(this.selectedSurveyIndex,1)

            //this.updateDisplayedSurveys();
          }
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
    this.selectedSurveyIndex = index;
    this.questions = this.survey.questions[0];
    }

    selectAnswer(e:Event,index){
    e.preventDefault();
    this.selectedAnswersIndex = index;
    var ai = this.displayanswered[index].submissions.findIndex(
      a => (a.submitter_id == this.user_id )
    )
    console.log("submission id "  + ai)
    console.log("survey index id " +  index)
    console.log(this.displayanswered)
    this.answers = this.displayanswered[index].submissions[ai].answers
    var an = this.displayanswered[index].submissions[ai].answers
    console.log(an)

    this.answers =[]
    for (var key in an) {
      for( var key2 in an[key]){
        this.answers.push({
          q: key2,
          a: an[key][key2]
        })
      }
    }
  }

  updateDisplayedSurveys(){

    this.displayesurveys = this.surveysService.filterSurveysByStatus(this.displayesurveys,true);
    this.surveysService.formatSurveys(this.displayesurveys);
    this.surveysService.formatSurveys(this.displayanswered);
  }

}
