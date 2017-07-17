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

}
