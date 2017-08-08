import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver'  
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http'
import 'rxjs/add/operator/map';
import { Observable } from "@angular/core/src/facade/async";

@Injectable()
export class FileService {

  url="http://localhost:3000"
  filesizelimit = 4000000

  constructor(
    private http: Http
  ) { }

  uploadImage( user_id , file:File ){
      let headers = new Headers()

      let formData:FormData = new FormData();
      formData.append('image', file, file.name);
      formData.append('user_id', user_id);

      if(file.size <  this.filesizelimit ) 
        return this.http.post(this.url+"/files/image",formData,{headers:headers})
          .map(res => res.json() )
      else{
        let ob = new Observable(observer => observer.next({success:false,msg:"File too large (Limit: "+this.filesizelimit/1000000+" Mb)"}) )
          return ob
      }
  }

  uploadFile( user_id, file:File ){
      let headers = new Headers()

      let formData:FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('user_id', user_id);

       if(file.size <  this.filesizelimit ) 
        return this.http.post(this.url+"/files",formData,{headers:headers})
          .map(res => res.json() )
      else{
        let ob = new Observable(observer => observer.next({success:false,msg:"File too large (Limit: "+this.filesizelimit/1000000+" Mb)"}) )
          return ob
      }
  }

  downloadFile(filename){
    let headers = new Headers()

    return this.http.get(this.url+"/files/"+filename,{headers:headers,responseType: ResponseContentType.Blob})
      .map(res => res.blob())
      .subscribe( res => {
        saveAs(res,filename)
        //var url= window.URL.createObjectURL(res);
        //window.open(url);
    })
  }

  openFile(filename){
    let headers = new Headers()

    return this.http.get(this.url+"/files/"+filename,{headers:headers,responseType: ResponseContentType.Blob})
      .map(res => res.blob())
      /*
      .subscribe( res => {
        //saveAs(res,filename)
        var reader = new FileReader()
        reader.addEventListener("load",()=>{
          window.open().document.write("<iframe src='"+reader.result+"'></iframe>")
        })
        reader.readAsDataURL(res)
      })
      */
  }

   deleteFile(filename){
    let headers = new Headers()
    return this.http.delete(this.url+"/files/"+filename,{headers:headers})
      .map(res => res.json() )
  }

  formatFile(file){
    //Get Icon
    switch(file.type){
      case "gif":
      case "png":
      case "jpeg": file.icon = "fa-file-image-o"; break;
      case "docx":
      case "doc":
      case "pdf":
      case "txt":
      case "odt": file.icon = "fa-file-text-o"; break;
      case "zip": 
      case "rar": file.icon = "fa-file-archive-o"; break;
      default: file.icon = "fa-file-o"
    }
    file.icon = "fa "+file.icon+" fa-3x"

    if( String(file.size).match(/^[0-9]+$/) )
    {
        console.log('matched ', file.size)
      if( file.size >= 1000000000)
        file.size = Math.ceil(file.size/1000000000) + " Go"
      else if( file.size >= 1000000)
        file.size = Math.ceil(file.size/1000000) + " Mo"
      else if(file.size >= 1000)
        file.size = Math.ceil(file.size/1000) + " ko"
      else
        file.size = file.size + " o"
    }
  }

}
