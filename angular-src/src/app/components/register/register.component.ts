import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name:String;
  username:String;
  email:String;
  password:String;

  errMsg : String[] = [];

  constructor(
    private authService: AuthService,
    private validateService: ValidateService,
    private flashMessages: FlashMessagesModule,
    private router: Router,
    private toastr: ToastrService
  ) 
  {}

  ngOnInit() {
  }

  onRegisterSubmit(event: Event){

    event.preventDefault();
    const user = {
      "name":this.name,
      "username":this.username,
      "email":this.email,
      "password":this.password
    }

    this.errMsg = [];

    if (!this.validateService.validateUser(user)){
      this.toastr.clear();
      this.toastr.info("Some fields are still missing","Wait");
      this.errMsg.push("Please enter all fields");
      return false;
    } 

    if (!this.validateService.validateEmail(user.email)){
      this.toastr.clear();
      this.toastr.info("Enter a proper email address","Wait");
       this.errMsg.push("Please enter a valide email");
       return false;
    }
    // Register user
    this.authService.registerUser(user).subscribe(data =>{
      if (data.success){
        this.toastr.clear();
        this.toastr.success("You hav been properly registered!","Congrats");
        this.router.navigate(['/login']);
      }else{
        this.toastr.clear();
        this.toastr.error("Somthing went wrong with the registration./nPlease try again later.","Oops!");
        this.router.navigate(['/register']);
      }
      
    })
  }

}
