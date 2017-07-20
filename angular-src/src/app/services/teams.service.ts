import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map'; 

@Injectable()
export class TeamsService {

  constructor(private http:Http) { }

  getUserTeams(team_id){
    console.log('http://localhost:3000/teams/get/'+team_id);
    return  this.http.get('http://localhost:3000/teams/get/'+ team_id )
      .map(res => res.json());
  }

  getValidTeams(Teams:any[]){
    Teams.forEach(element => {
      
    });
  }
}
