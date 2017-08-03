import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
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
        return this.http.post(this.url+"/files",formData,{headers:headers})
          .map(res => res.json() )
      else{
        let ob = new Observable(observer => observer.next({success:false,msg:"File too large (Limit: "+this.filesizelimit/1000000+" Mb)"}) )
          return ob
      }
      
      
  }

}
