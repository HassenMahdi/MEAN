import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  username:String;
  password:String;

  constructor(
    private authService: AuthService,
     private router: Router,
     private toaster: ToastrService
  ) { }

  ngOnInit() {
  }


  onLoginSubmit(){
    const user = {
      username:this.username,
      password:this.password
    }


    this.authService.loginUser(user).subscribe(data=>{
      if (data.success){
        this.router.navigate(['/profile']);
        this.toaster.clear();
        this.toaster.success("you are now logged in","HELLO THERE!");
        console.log(data);
        this.authService.storeUserData(data.token,user);
      }else{
        this.toaster.error("Please check your username and password","Oops!");
        this.router.navigate(['/login']);
        console.log(data);
      }
      
    })


    console.log(user);

    
  }

}
