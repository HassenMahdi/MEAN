import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  private url = 'http://localhost:3000';  
  private socket;

  sendMessage(tweet){
    this.socket.emit('add-message', tweet);    
  }
  
  getMessages(username, teamname) {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.emit('new user',{username: username, teamname:teamname});
      this.socket.on('tweet', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  } 

}