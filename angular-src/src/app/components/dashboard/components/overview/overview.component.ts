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
  dataset1:any
  dataset2:any
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
        console.log("Got data")
        this.datasets1 = res.list || []
        this.activesurveys = res.active_surveys || []
        this.upcomingsurveys = res.upcoming_surveys || []
        this.activemembers = res.activemembers || []
        this.dataset1 = {
          data : [5,10,8],
          labels :["Tom","Peter","Hannibal"]
        }
        this.dataset2 = {
          data : [1,2,3,4],
          labels :["greg","Lecter","Butcher","Kate"]
        };
        
      })     

    })
    
  }
}
