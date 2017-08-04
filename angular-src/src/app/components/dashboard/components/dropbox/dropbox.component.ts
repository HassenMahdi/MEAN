import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../../services/file.service'

@Component({
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
  styleUrls: ['./dropbox.component.css']
})
export class DropboxComponent implements OnInit {

  loading:boolean = true;
  files:any[] = null;

  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.loading = false;
      this.files=[]
    },2000)
  }
}
