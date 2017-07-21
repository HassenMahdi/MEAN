import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TeamsService } from '../../services/teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user : Object;
  public teams : Object[];

  constructor(
    private router : Router,
    private authService : AuthService,
    private teamsService : TeamsService,
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
      this.user = profile.user;
      this.teams = this.teamsService.getValidTeams(profile.user.teams)
      
    },
    err=>{
      console.log(err);
      return false;
    })
  }
  

}
