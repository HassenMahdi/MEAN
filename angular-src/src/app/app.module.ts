import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule , Routes } from '@angular/router';
import { ToastrModule } from 'toastr-ng2';

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
import { AuthGuard } from './guards/auth.guard';
import { ViewContainerRef } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatsComponent } from './components/dashboard/components/stats/stats.component';
import { CreateSurveyComponent } from './components/dashboard/components/create-survey/create-survey.component';
import { OverviewComponent } from './components/dashboard/components/overview/overview.component';
import { MessagesComponent } from './components/dashboard/components/messages/messages.component';
import { TeamsComponent } from './components/dashboard/components/teams/teams.component';
import { HistorySurveyComponent } from './components/dashboard/components/history-survey/history-survey.component';

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
      {path:'survey' ,
        children:[
          {path:'' , redirectTo: 'create' , pathMatch: 'full'},
          {path:'create' , component: CreateSurveyComponent},
          {path:'history' , component: HistorySurveyComponent}
        ]}    
    ]},
  {path:'profile' , component: ProfileComponent , canActivate:[AuthGuard]}
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
    HistorySurveyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot()
  ],
  providers: [ 
    ValidateService,
    AuthService,
    AuthGuard,
    TeamsService,
    SurveysService
  ],
  bootstrap: [
    AppComponent
    ]
})
export class AppModule { }