import { Component, OnInit , ViewChild} from '@angular/core';
import { AuthService } from '../../../../services/auth.service'
import { StatService } from '../../../../services/stat.service'



@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  user:any
  datasets1:any[]
  activesurveys:any[]
  upcomingsurveys:any[]
  activemembers:any[]

  constructor(
    private authService : AuthService,
    private statService : StatService,
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.user = profile.user
      
      var team_list = []
          this.user.teams.forEach(team => {
            if (team.team)
            team_list.push(team.team._id)
      })
        
      this.statService.getLogsStats(team_list).subscribe(res=>{
        this.datasets1 = res.list
        this.activesurveys = res.active_surveys
        this.upcomingsurveys = res.upcoming_surveys
        this.activemembers = res.activemembers
        console.log(this.upcomingsurveys)
      })     

    })
    
  }

  public pieChartType:string = 'pie';

  // Doughnut
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    steppedLine:true,
  };
  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
