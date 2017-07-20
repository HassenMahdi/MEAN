import { Component, OnInit } from '@angular/core';
import { StatsComponent } from './components/stats/stats.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  userInfo:any;

  constructor() { }

  ngOnInit() {
  }

}
