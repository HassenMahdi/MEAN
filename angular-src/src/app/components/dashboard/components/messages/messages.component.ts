import { Component, OnInit, ViewChild, QueryList, AfterContentInit} from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { TeamsService } from '../../../../services/teams.service';
import { ChatService } from '../../../../services/chat.service';
import { ChatComponent } from './chat/chat.component';

declare var jQuery : any;


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @ViewChild(ChatComponent) private chatBoxes:ChatComponent

  private user: any;
  private teams: any[];
  private team: any;

  selectedTeam = 0;
  connection;
  message;
  messages=[];

  constructor(
    private authService: AuthService,
    private teamService: TeamsService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
        this.user = profile.user;
        this.teams = this.teamService.getValidTeams(profile.user.teams) ;
        
        this.openChatBox(0)

      },
      err=>{
        console.log(err);
        return false;
      })
  }

  selectTeam(index){
    this.team=null;
    
    this.teamService.getUserTeam(this.teams[index].team._id).subscribe( res => {
          this.team = res.team;
          this.selectedTeam = index;
          console.log('index');
          console.log(this.selectedTeam);
        },
        err=>{
          console.log(err);
          return false;
        });
  }

  openChatBox(i){
    this.team=null;
    
    this.teamService.getUserTeam(this.teams[i].team._id).subscribe( res => {
          this.team = res.team;
          this.selectedTeam = i;
          console.log('index');
          console.log(this.selectedTeam);
          this.chatBoxes.subscribeRoom(this.user,this.team);
        },
        err=>{
          console.log(err);
          return false;
        });
    //$('#chat-box-list > div').hide();
    //$('#chat-box-list > div[id="'+i+'"]').show();
  }

}
