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
  private team: any;

  constructor(
    private teamService : TeamsService,
    private authService : AuthService,
  ) { }

  ngOnInit() {
     this.authService.getProfile().subscribe( profile => {
        this.user = new Object(profile.user);
        console.log(this.user);

        this.teamService.getUserTeams(this.user.teams[0]._id).subscribe( team => {
          this.team = team;
          console.log(team);
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

}
