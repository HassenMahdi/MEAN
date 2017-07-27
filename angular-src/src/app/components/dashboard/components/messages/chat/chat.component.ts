import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../../services/chat.service';
import { TeamsService} from '../../../../../services/teams.service';

declare var jQuery : any;

@Component({
  moduleId: module.id,
  selector: 'chat-component',
  styleUrls: ['./chat.component.css'],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy{
  messages = [];
  connection;
  message;
  tweets =[];
  tweet;
  
  @Input() team : any;
  @Input() username : any;

  constructor(
    private chatService:ChatService,
    private teamService:TeamsService  
  ) {}

  sendMessage(){
    this.teamService.saveMessage( this.team._id,this.message,this.username ).subscribe()
    this.chatService.sendMessage(this.message);
    this.messages.push({
      username:this.username,
      text:this.message
    })
    this.message = '';  
    var $target = $(".message-box")
    $target.animate({scrollTop: 99999}, "fast");
  }

  ngOnInit() { }
  ngOnDestroy() {
    this.connection.unsubscribe(this.username);
  } 

}
