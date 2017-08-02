import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule , Routes } from '@angular/router';
import { ToastrModule } from 'toastr-ng2';
import { ChartsModule } from 'ng2-charts';
import { MyDatePickerModule } from 'mydatepicker';
import { environment } from 'environments/environment'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { TeamsService } from './services/teams.service';
import { SurveysService } from './services/surveys.service';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { ChatService } from './services/chat.service'
import { StatService } from './services/stat.service'

import { AuthGuard } from './guards/auth.guard';
import { ViewContainerRef } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatsComponent } from './components/dashboard/components/stats/stats.component';
import { CreateSurveyComponent } from './components/dashboard/components/create-survey/create-survey.component';
import { OverviewComponent } from './components/dashboard/components/overview/overview.component';
import { MessagesComponent } from './components/dashboard/components/messages/messages.component';
import { TeamsComponent } from './components/dashboard/components/teams/teams.component';
import { HistorySurveyComponent } from './components/dashboard/components/history-survey/history-survey.component';
import { DynamicSurveyComponent } from './components/dashboard/components/create-survey/dynamic-survey/dynamic-survey.component';
import { SurveyQuestionQaComponent } from './components/dashboard/components/create-survey/dynamic-survey/survey-question-qa/survey-question-qa.component';
import { SurveyQuestionSrComponent } from './components/dashboard/components/create-survey/dynamic-survey/survey-question-sr/survey-question-sr.component';
import { AnswerSurveyComponent } from './components/dashboard/components/answer-survey/answer-survey.component';
import { EditorSurveyComponent } from './components/dashboard/components/editor-survey/editor-survey.component';
import { TakeSurveyComponent } from './components/dashboard/components/take-survey/take-survey.component';
import { ChatComponent } from './components/dashboard/components/messages/chat/chat.component';
import { ChartConnTodComponent } from './components/dashboard/components/overview/components/chart-conn-tod/chart-conn-tod.component';
import { UpcomingSurveysComponent } from './components/dashboard/components/overview/components/upcoming-surveys/upcoming-surveys.component';
import { ActiveSurveysComponent } from './components/dashboard/components/overview/components/active-surveys/active-surveys.component';
import { ChartPieComponent } from './components/dashboard/components/overview/components/chart-pie/chart-pie.component';
import { DropboxComponent } from './components/dashboard/components/dropbox/dropbox.component';

const appRoutes : Routes = [
  {path:'' , component: HomeComponent},
  {path:'login' , component: LoginComponent},
  {path:'register' , component: RegisterComponent},
  {path:'dashboard' , component: DashboardComponent , canActivate:[AuthGuard] ,
    children:[
      {path:'' , redirectTo: 'overview' , pathMatch: 'full'},
      {path:'overview' , component: OverviewComponent},
      {path:'profile' , component: ProfileComponent},
      {path:'statistics', component: StatsComponent},
      {path:'teams', component: TeamsComponent},
      {path:'messages', component: MessagesComponent},
      {path:'dropbox' , component: DropboxComponent},
      {path:'survey' ,
        children:[
          {path:'' , redirectTo: 'take' , pathMatch: 'full'},
          {path:'take' , component: TakeSurveyComponent},
          {path:'create' , component: CreateSurveyComponent},
          {path:'history' , component: HistorySurveyComponent}
        ]}    
    ]},
]; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    SidebarComponent,
    StatsComponent,
    CreateSurveyComponent,
    OverviewComponent,
    MessagesComponent,
    TeamsComponent,
    HistorySurveyComponent,
    DynamicSurveyComponent,
    SurveyQuestionQaComponent,
    SurveyQuestionSrComponent,
    AnswerSurveyComponent,
    EditorSurveyComponent,
    TakeSurveyComponent,
    ChatComponent,
    ChartConnTodComponent,
    UpcomingSurveysComponent,
    ActiveSurveysComponent,
    ChartPieComponent,
    DropboxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    MyDatePickerModule,
    ChartsModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    TeamsService,
    SurveysService,
    FirebaseService,
    ChatService,
    StatService
  ],
  bootstrap: [
    AppComponent
    ]
})
export class AppModule { }
