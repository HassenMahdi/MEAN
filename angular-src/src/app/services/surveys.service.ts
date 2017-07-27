import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';

declare var dateFormat : any;

@Injectable()
export class SurveysService {

  constructor(private http:Http) { }

  getSurveys(){
    console.log('http://localhost:3000/surveys/get/');
    return  this.http.get('http://localhost:3000/surveys/get/')
      .map(res => res.json());
  }

  getOwnedSurveys(owner_id){
    return this.http.get('http://localhost:3000/surveys/get/owner/'+owner_id)
      .map(res => res.json());
  }

  getTeamsSurvey(team_id_list){
    return this.http.get('http://localhost:3000/surveys/get/teams/'+team_id_list.toString())
      .map(res => res.json());
  }

  CreateSurvey(survey){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/surveys/add',survey)
      .map(res => res.json());
  }

  submitSurveyAnswers( survey_id, submitter_id, answers ){
    
    let body = {
      sub : {
        submitter_id : submitter_id,
        answers : answers,
      },
      survey_id : survey_id,
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/surveys/add/answers',body)
      .map(res => res.json());
  }

  formatSurveys(surveys:any[]){
    if (surveys == null ) return;
    surveys.forEach(element => {

      if (new Date(element.enddate) >= new Date())
      {
        element.active = true;
        element.activeclass= "activesurvey";
      }
      else{ 
        element.active = "false"
        element.activeclass= "inactivesurvey";
      }

      element.begindate = dateFormat(element.begindate, "dd/mm/yyyy");
      element.enddate = dateFormat(element.enddate, "dd/mm/yyyy");      
    });
  }

  filterSurveysByStatus(surveys:any[], getActive: Boolean){
    console.log(surveys);
    if (surveys == null ) return;
    surveys = surveys.filter((element,index) => {
      if (new Date(element.enddate) >= new Date())
      {
        element.active = true;
      }
      else{ 
        element.active = false;
      }
      if (getActive)
        return element.active;
      else
        return !element.active;
    })
    return surveys;
  }

  formatAnswersTable(questions, subs){

    var table = new Array(subs.length);
    for (var i = 0; i < subs.length; i++) {
      table[i] = new Array(questions.length);
    }
    var qList=[];

    try{
      questions.pages.forEach(page => {
        page.elements.forEach(element => {
          qList.push(element.name);
        });
      });

      qList.forEach((question,col) => {
        subs.forEach((sub,row) => {

          var an = sub.answers;

          var answers =[]

          for (var key in an) {
            for( var key2 in an[key]){
                answers.push({
                q: key2,
                a: an[key][key2]
              })
            }
          }

          for( var i = 0 ; i < answers.length ; i++ )
          { var answer = answers[i];
            if ( answer.q == question)
            {
              table[row][col] = answer.a;
              sub.answers.splice(i,1);
              break;
            }
          }
        });
      });
    }
    catch(e){
      console.log("Bad survey format")
    }
    
    return {
       answers : table,
       questions : qList,
    };
  }
  

}
