import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule , Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ToastrModule } from 'toastr-ng2';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ViewContainerRef } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatsComponent } from './components/dashboard/components/stats/stats.component';
import { CreateSurveyComponent } from './components/dashboard/components/create-survey/create-survey.component';
import { OverviewComponent } from './components/dashboard/components/overview/overview.component';

const appRoutes : Routes = [
  {path:'' , component: HomeComponent},
  {path:'login' , component: LoginComponent},
  {path:'register' , component: RegisterComponent},
  {path:'dashboard' , component: DashboardComponent , canActivate:[AuthGuard] ,
    children:[
      {path:'' , component: OverviewComponent },
      {path:'profile' , component: ProfileComponent},
      {path:'survey' , component: CreateSurveyComponent},
      {path:'statistics', component: StatsComponent}
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
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    ToastrModule.forRoot()
  ],
  providers: [ 
    ValidateService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
    ]
})
export class AppModule { }
