import { Component, OnInit, Input } from '@angular/core'
import { SurveysService } from '../../../../../../services/surveys.service'

@Component({
  selector: 'app-active-surveys',
  templateUrl: './active-surveys.component.html',
  styleUrls: ['./active-surveys.component.css']
})
export class ActiveSurveysComponent implements OnInit {

  @Input() activesurveys: any;

  constructor(
    private  surveysService : SurveysService
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes:any){
    if (!this.activesurveys) return
      this.surveysService.formatSurveys(this.activesurveys)
  }
}
