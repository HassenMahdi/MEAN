import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map'; 
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class AuthService {

  authToken:any;
  user:any;
  private userSubject = new Subject<any>()

  url="http://localhost:3000"

  constructor(private http:Http) {}

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/users/register', user, {headers:headers})
      .map(res => res.json());
  }

  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/users/authenticate', user, {headers:headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return  this.http.get('http://localhost:3000/users/profile', {headers:headers})
      .map(res => res.json());
  }

  updateUser(user){
    this.userSubject.next(user)
  }

  getUser(){
    return this.userSubject.asObservable()
  }

  saveUserRegToken(user_id, token){
    let body = {
      user_id : user_id,
      token : token,
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/users/regtoken', body, {headers:headers})
      .map(res => res.json());
  }

  changePassword(user_id,oldpass,newpass){
    let body ={
      user_id:user_id,
      oldpass:oldpass,
      newpass:newpass,
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return  this.http.post('http://localhost:3000/users/pass', body, {headers:headers})
      .map(res => res.json());
  }

  loadToken(){
    const token= localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  storeUserData(token, user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout(){
    localStorage.clear();
    this.authToken = null;
    this.user = null;
  }

  saveImageUrl(user_id,url){
    let body = {
      user_id:user_id,
      image:url
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put(this.url+'/users/pic/url',body, {headers:headers})
      .map(res => res.json());
  }

  saveImageFile(){

  }
}
