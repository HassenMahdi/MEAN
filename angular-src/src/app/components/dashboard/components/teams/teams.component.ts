import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../../../services/teams.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  private user: any;
  private teams: any[];
  private team: any;

  constructor(
    private teamService : TeamsService,
    private authService : AuthService,
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe( profile => {
        this.user = profile.user;
        this.teams = profile.user.teams ;
        this.team = this.teams[0].team;
        
        console.log(this.user);
        console.log(this.teams);

        this.teamService.getUserTeams(this.team._id).subscribe( res => {
          this.team = res.team;
          console.log(res);
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
          console.log(res);
        },
        err=>{
          console.log(err);
          return false;
        });
  }

}
