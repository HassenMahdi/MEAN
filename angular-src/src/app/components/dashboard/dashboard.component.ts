import { Component, OnInit } from '@angular/core'
import { StatsComponent } from './components/stats/stats.component'
import { environment } from 'environments/environment'
import { FirebaseService } from '../../services/firebase.service'
import { AuthService } from '../../services/auth.service'
import { ChatService } from '../../services/chat.service'
//import * as firebase from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  user: any;
  userRegToken: any;
  connection:any;
  messages=[];

  constructor(
    private fireService : FirebaseService, 
    private authService : AuthService,
    private chatService : ChatService
  ){}

  ngOnInit() {

    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    })

    this.user = JSON.parse(localStorage.getItem('user'))
    
    this.fireService.getUserRegToken(token =>{
      this.authService.saveUserRegToken(this.user._id,token).subscribe(res=>{
        if (res.success)
          console.log("Token for user addad");
        else
          console.log(res.msg);
      })
    })
  }
}
