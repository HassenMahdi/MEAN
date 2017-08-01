import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TeamsService } from '../../services/teams.service';
import { ToastrService } from 'toastr-ng2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user;
  public teams;
  
  private oldpass: any = "";
  private newpass: any = "";
  private newpassc: any = "";
  msg1;msg2;msg3;

  constructor(
    private router : Router,
    private authService : AuthService,
    private teamsService : TeamsService,
    private toastr : ToastrService,
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
  
  comparePass(){
    this.msg3 = null
    if(this.newpassc == "" ) return;
    if(this.newpass != this.newpassc)
      this.msg3 = "Different passwords have been entered"
    return;
  }

  changePass(){
    this.msg1=null;
    this.msg2=null;
    this.msg3=null;
    if (this.newpass == "" ){
      this.msg2 = "Please enter a new password"
    }else if (this.newpass != this.newpass ){
      this.msg3 = "Different passwords have been entered"
    }
    if ( this.oldpass == "" ){
      this.msg1 = "Please enter your old password"
    }
    if( this.msg1||this.msg2||this.msg3 ) return;
    this.authService.changePassword(this.user._id,this.oldpass,this.newpass).subscribe(res=>{
      if(res.success){
        this.toastr.success("Your password have been changed");
        this.oldpass = "";
        this.newpass = "";
        this.newpassc= "";
      }else if(!res.success){
        this.msg1="Wrong password";
      }
    })
    
  }


}
