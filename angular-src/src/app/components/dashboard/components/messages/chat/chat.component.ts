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
  connectedUsers;
  typing_emissions:String[]=[];
  feedbacks= [];

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
          this.team.feedbacks = []
          
          this.connection = this.chatService.initialize(this.username, this.team.team_name,this.team._id).subscribe(message => {
              
            if( message["text"] )
                this.team.messages.push( message );
            
            if( message["rooms"])
              this.connectedUsers = message["rooms"];
            
            if ( message["newRoom"])
              this.team.feedbacks.push('You are connected to ' +message["newRoom"]);
            
            if ( message["newUser"])
              this.team.feedbacks.push('@'+message["newUser"]+' has '+message["message"]);
             
            if ( message["typingUser"]){
               if (this.typing_emissions.indexOf(message["typingUser"]) == -1){
                    this.typing_emissions.push(message["typingUser"]);  
               }
             }
                
            if ( message["noneTypingUser"])
            {
              this.typing_emissions.splice(this.typing_emissions.indexOf(message["noneTypingUser"]),1) 
            }
          
             scrollDown();
          })
          
        }
        
  }

  timeoutref

  typing(){
    clearTimeout(this.timeoutref)
    this.chatService.typingStarts(this.username,this.team._id)
    this.timeoutref=setTimeout(()=>{
      this.chatService.typingEnds(this.username,this.team._id)
    },2000)
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
