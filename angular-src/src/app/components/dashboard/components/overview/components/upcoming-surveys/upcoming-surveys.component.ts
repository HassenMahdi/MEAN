import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SurveysService } from '../../../../../../services/surveys.service'

@Component({
  selector: 'app-upcoming-surveys',
  templateUrl: './upcoming-surveys.component.html',
  styleUrls: ['./upcoming-surveys.component.css']
})

export class UpcomingSurveysComponent implements OnInit {

  @Input() upcomingsurveys:any;

  constructor(
    private  surveysService : SurveysService
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes:any){
    if (!this.upcomingsurveys) return
      this.surveysService.formatSurveys(this.upcomingsurveys)
  }

}
