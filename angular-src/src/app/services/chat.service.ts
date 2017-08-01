import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  private url = 'http://localhost:3000';  
  private socket;

  sendMessage(tweet){
    this.socket.emit('add-message', tweet);    
  }
  
  getMessages(username, team_id) {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.emit('switch room',{newRoom:team_id});
      this.socket.on('tweet', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }

  joinDashboard(username) {
    let observable = new Observable(observer => {
    this.socket=io(this.url);
    this.socket.emit('new user',{username: username});
    return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }
  
  initialize(username, teamname, teamid) {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.emit('new chatter',{username: username, teamname:teamname, team_id: teamid});
      this.socket.on('tweet', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }
  
  switchRoom(team_id){
    this.socket.emit('switch room', {newRoom: team_id});
  }

}