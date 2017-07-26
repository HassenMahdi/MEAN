import { Component, OnInit } from '@angular/core';
declare var jQuery : any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openChatBox(i){
    $('#chat-box-list > div').hide();
    $('#chat-box-list > div[id="'+i+'"]').show();
  }

}
