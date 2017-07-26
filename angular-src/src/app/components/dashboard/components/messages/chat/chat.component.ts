import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../../services/chat.service';
import { AuthService} from '../../../../../services/auth.service';
import { TeamsService} from '../../../../../services/teams.service';


@Component({
  moduleId: module.id,
  selector: 'chat-component',
  styleUrls: ['./chat.component.css'],
  templateUrl: './chat.component.html',
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy{
  private user: any;
  private teams: any[];
  private team: any;

  messages = [];
  connection;
  message;
  
  constructor(
    private chatService:ChatService,
    private authService:AuthService,
    private teamService:TeamsService
  
  ) {}

  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
        this.user = profile.user;
        this.teams = this.teamService.getValidTeams(profile.user.teams) ;
        this.team = this.teams[0].team;
        this.teamService.getUserTeams(this.team._id).subscribe( res => {
          this.team = res.team;
        },
        
        err=>{
          console.log(err);
          return false;
        });
        
        
      },
      err=>{
        console.log(err);
        return false;             
      })
  }

  ngOnDestroy() {
    this.connection.unsubscribe(this.user.username);
  } 
  
  
}