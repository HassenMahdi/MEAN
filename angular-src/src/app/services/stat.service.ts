import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http'
import 'rxjs/add/operator/map';

@Injectable()
export class StatService {

  url = "http://localhost:3000"

  constructor(
    private http: Http,
  ) { }

  getLogsStats(team_list){
    return this.http.get(this.url+"/stats/"+team_list.toString())
      .map(res => res.json());
  }

}
