import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../../services/file.service'
import { AuthService } from '../../../../services/auth.service'
import { ToastrService } from 'toastr-ng2'

@Component({
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
  styleUrls: ['./dropbox.component.css']
})
export class DropboxComponent implements OnInit {

  loading:boolean = true
  files:any[] = null
  file:any
  user_id:any
  user:any

  constructor(
    private fileService: FileService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.user_id = JSON.parse(localStorage.getItem("user"))._id;
    this.authService.getProfile().subscribe(res=>{
      this.files = res.user.files
      this.user = res.user
      this.loading = false;
      console.log(this.files)
    })
  }

  confirmUpload(e){
    if( !e.target.files ) return;
    var file:File = e.target.files[0];
    this.fileService.uploadFile(this.user_id, file).subscribe(res=>{
      if (res.success){
        this.toastr.success("File successfully uploaded")
        this.files.push(res.file)
      }else{
        this.toastr.error(res.msg)
      }
    })
  }

  downloadFile(e:Event,path){
    e.preventDefault()
    this.fileService.downloadFile(path.split('/').pop())
  }

  openFile(e:Event,path){
    e.preventDefault()
    $("#frame").attr("src","")
    this.fileService.openFile(path.split('/').pop())
     .subscribe( res => {
        var reader = new FileReader()
        reader.addEventListener("load",()=>{
          $("#frame").attr("src",reader.result)
        })
        reader.readAsDataURL(res)
      })
  }

  deleteFile(e:Event,path){
    e.preventDefault()
    this.fileService.deleteFile(path.split('/').pop()).subscribe(res=>{
      if(!res.success)
        this.toastr.error(res.msg)
      else{
        this.toastr.success("File deleted")
        var index = this.files.findIndex(file => (file.path == path) )
        this.files.splice(index,1)
        this.file = null;
      }
    })
  }

  selectFile(file_index){
    this.file=null;
    setTimeout(()=>{
      var file = this.files[file_index]
      this.fileService.formatFile(file)
      this.file = file
    }) 
  }
}