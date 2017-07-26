import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service'
import { TeamsService } from '../../../../services/teams.service'


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild('myModal') modal;

  private user: any;
  private teams: any[];
  private team: any;

  selectedTeam = 0;

  constructor(
    private authService: AuthService,
    private teamService: TeamsService
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
          window.open('chat','_blank');
        },
        err=>{
          console.log(err);
          return false;
        });
  }

}
