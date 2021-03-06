import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map'; 
@Injectable()
export class TeamsService {

  constructor(private http:Http) { }

  getUserTeam(team_id){
    //console.log('http://localhost:3000/teams/get/'+team_id);
    return  this.http.get('http://localhost:3000/teams/get/'+ team_id )
      .map(res => res.json());
  }

  addTeam(team){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/teams/create', team, {headers:headers})
      .map(res => res.json());  
  }

  getMemberbyUsername(username){
    return  this.http.get('http://localhost:3000/users/get/'+ username )
      .map(res => res.json());
  }
    
  addMember(member_id,team_id){
    const newObject = {
      "member_id":member_id,
      "team_id":team_id,
      "leader":false
    }  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/teams/members', newObject, {headers:headers})
      .map(res => res.json());
  }

  removeMember(object){  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.delete('http://localhost:3000/teams/members', new RequestOptions({
              headers: headers,
              body: object
            }))
      .map(res => res.json());
  }

  addLeader(member_id,team_id){
    const newObject = {
      "member_id":member_id,
      "team_id":team_id,
      "leader":true
    }  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/teams/members', newObject, {headers:headers})
      .map(res => res.json());
  }
  
  removeLeader(object){  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.delete('http://localhost:3000/teams/leaders', new RequestOptions({
              headers: headers,
              body: object
            }))
      .map(res => res.json());

  }

  removeTeam(id){ 
    var headers = new Headers();
    return  this.http.delete('http://localhost:3000/teams/'+id, {headers:headers})
      .map(res => res.json());
  }

  graduateMember(member_id,team_id){
    const newObject = {
      "member_id":member_id,
      "team_id":team_id,
    }  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/teams/graduate', newObject, {headers:headers})
      .map(res => res.json());
  }

  getValidTeams(teams:any[]){
    teams = teams.filter((ele)=>{
      if (ele.team)
        return true;
      else
        return false;
    })
    return teams;
  }

  saveMessage(team_id, text ,username ){
      let body = {
      team_id:team_id,
      username:username,
      text:text,
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/teams/message', body, {headers:headers})
      .map(res => res.json());
  }

  editTeam(team_id,team_name,team_info){
    const newObject = {
      "team_name":team_name,
      "team_info":team_info
    }  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/teams/edit/'+team_id, newObject, {headers:headers})
      .map(res => res.json());
  }
}    

