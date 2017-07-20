import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map'; 

@Injectable()
export class SurveysService {

  constructor(private http:Http) { }

  getSurveys(){
    console.log('http://localhost:3000/surveys/get/');
    return  this.http.get('http://localhost:3000/surveys/get/')
      .map(res => res.json());
  }

  getOwnedSurveys(owner_id){
    console.log('http://localhost:3000/surveys/get/owner/' + owner_id );
    return this.http.get("http://localhost:3000/surveys/get/" + owner_id)
      .map(res => res.json());
  }

  CreateSurvey(survey){
    console.log('http://localhost:3000/surveys/add');
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/surveys/add',survey)
      .map(res => res.json());
  }
  

}
