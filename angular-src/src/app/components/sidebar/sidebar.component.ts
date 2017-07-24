import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private user : Object;

  constructor(
    private authService : AuthService,
  ) { }

  
  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
      this.user = profile.user;      
    },
    err=>{
      console.log(err);
      return false;
    })

    console.log(this.user);
  }
  

}
