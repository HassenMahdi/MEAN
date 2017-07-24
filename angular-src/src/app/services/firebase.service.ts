import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {

  constructor() { }

  init(){
    firebase.initializeApp(environment.firebase)
  }

  getUserRegToken(done){
    
    const messaging = firebase.messaging();

    messaging.onMessage(function(payload){
          console.log(payload);
      })
    
    messaging.requestPermission()
      .then(function(){
          console.log("have permission")
          return messaging.getToken()
      })
      .then(function(token){
         done(token);
      })
      .catch(function(err){
        console.log(err)
      })
  }
}
