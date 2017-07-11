import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'toastr-ng2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService,
    private toastr : ToastrService
  ) { 
 
  }

  ngOnInit() {
  }

  logout(e : Event){
    e.preventDefault();
    this.toastr.warning("Logged out.","Bye Bye!");
    this.authService.logout();
    this.router.navigate(['/']); 
  }

}
