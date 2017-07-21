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
    console.log('http://localhost:3000/surveys/get/owner/'+owner_id );
    return this.http.get('http://localhost:3000/surveys/get/owner/'+owner_id)
      .map(res => res.json());
  }

  CreateSurvey(survey){
    console.log('http://localhost:3000/surveys/add');
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
  

}
