import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user : Object;

  constructor(
    private router : Router,
    private authService : AuthService,
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
      this.user = profile.user;

      console.log(this.user);
      
    },
    err=>{
      console.log(err);
      return false;
    })

    console.log(this.user);
  }
  

}
