import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.css']
})
export class ChartPieComponent implements OnInit {


  @Input() list : any
  @Input() user : any

  @ViewChild(BaseChartDirective) chart : BaseChartDirective 

  gotData:boolean = false
  message :any

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: any){
    if (!this.user || !this.list) return;
      if (!this.list.data || !this.list.labels ){
        this.message = "No data found to process";
        return;
      }
      this.gotData = true
      this.chart.chartType = this.pieChartType
      this.chart.data = this.list.data
      this.chart.labels = this.list.labels
      this.chart.options = this.pieChartOptions

      this.chart.getChartBuilder(this.chart.ctx)

  }

  public pieChartLabels:string[] = ["loading..."];
  public pieChartData:number[] = [1];
  public pieChartType:string = 'doughnut';

  public pieChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    steppedpie:true,
  };
  
  public pieChartLegend:boolean = true;
}
