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

  ngOnInit(){
    
  }

    subscribeRoom(user, team){
      
        if(this.connection != undefined )
          this.connection.unsubscribe(this.username);

        if ( user && team )
        {
          this.username= user.username;
          this.team = team;
          
          this.connection = this.chatService.initialize(this.username, this.team.team_name,this.team._id).subscribe(message => {
              
                this.team.messages.push( message );
                scrollDown();
          })
          scrollDown();
        }
        
  }

  sendMessage(){
    if( !this.connection ) return;
    if ( this.message == null || this.message == "" ) return;

    var tweet = {
      team: this.team._id,
      username: this.username,
      text: this.message,
    }
    
    this.teamService.saveMessage(this.team._id, this.message , this.username ).subscribe()
    this.chatService.sendMessage(tweet);
    
    this.message = '';  
  }

  ngOnDestroy() {
    if(this.connection != null )
    this.connection.unsubscribe(this.username);
  } 

}

function scrollDown(){
    $(".message-box").animate({scrollTop: 99999 }, "slow")
}
