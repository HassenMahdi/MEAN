import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service'
import { TeamsService } from '../../../../services/teams.service'
import { ChatService } from '../../../../services/chat.service'

declare var jQuery : any;


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

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

  selectTeam(index){
    this.team=null;
    
    this.teamService.getUserTeams(this.teams[index].team._id).subscribe( res => {
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
    this.connection = this.chatService.getMessages(this.user.username, this.selectedTeam).subscribe(message => {
          this.messages.push(message);
        }) 
    $('#chat-box-list > div').hide();
    $('#chat-box-list > div[id="'+i+'"]').show();
  }

}
