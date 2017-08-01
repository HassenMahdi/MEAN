import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-chart-conn-tod',
  templateUrl: './chart-conn-tod.component.html',
  styleUrls: ['./chart-conn-tod.component.css']
})
export class ChartConnTodComponent implements OnInit {

  @Input() list : any
  @Input() user : any

  @ViewChild(BaseChartDirective) chart : BaseChartDirective 

  gotData:boolean = false

  constructor() { }

  ngOnInit() {

       var today = new Date()
        var days= new Array(7)
        var weekday = new Array(7);
          weekday[0] =  "Sun";
          weekday[1] = "Mon";
          weekday[2] = "Tue";
          weekday[3] = "Wed";
          weekday[4] = "Thu";
          weekday[5] = "Fri";
          weekday[6] = "Sat";

        for( var i = 0 ; i<7;i++ ){
          var ind = new Date(today.getTime() + -i * 24 * 60 * 60 *1000).getDay();
          days[i] = weekday[ind];
        }
          days[0]=days[0]+"(Today)"
          this.lineChartLabels=days

  }

  ngOnChanges(changes:any){
    if (!this.user || !this.list) return
      
      var list=[];
      var teams = this.user.teams 
      
      this.list.forEach((ele,it) => {

        var team_index =  teams.findIndex(team =>{
              if (team.team)
                return team.team._id == ele.team 
              else
                return false
            })

        var team_name = teams[team_index].team.team_name

        list.push({
            data: ele.stats,
            label:team_name,
          })
      });
        

      this.chart.datasets=list
      this.chart.labels=this.lineChartLabels
      this.chart.options=this.lineChartOptions
      this.chart.chartType =this.lineChartType

      this.gotData = true
      this.chart.getChartBuilder(this.chart.ctx)
        
  }
  // lineChart
  public lineChartData
  
  public lineChartLabels
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    steppedLine:true,
  };
  
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'bar';

}
