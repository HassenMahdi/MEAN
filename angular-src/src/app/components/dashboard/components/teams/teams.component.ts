import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../../../services/teams.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { ViewChild , ElementRef } from '@angular/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  @ViewChild('myModal') modal;

  private user: any;
  private auth_user:any;
  private teams: any[];
  private team: any;
  private team_name:any;
  private team_info:any;
  private team_id:any;  
  private team_leaders:any[];
  private username:any;
  private user_name:any;
  private new_team_name:any;
  private new_team_info:any;

  selectedLeader = 0;
  selectedMember =0;
  selectedTeam = 0;
  constructor(
    private teamService : TeamsService,
    private authService : AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe( profile => {
        this.auth_user = profile.user;
        this.user=this.auth_user;
        this.teams = this.teamService.getValidTeams(profile.user.teams) ;
        console.log(this.teams);
        this.team = this.teams[0].team;
        this.teamService.getUserTeam(this.team._id).subscribe( res => {
          this.team = res.team;
        },
        err=>{
          console.log(err);
          return false;
        });
        
        
      },
      err=>{
        console.log(err);
        return false;
      })
  }

  selectTeam(index){
    this.team=null;
    
    this.teamService.getUserTeam(this.teams[index].team._id).subscribe( res => {
          this.team = res.team;
          this.selectedTeam = index;
          console.log('debugging');
          console.log(this.user.teams);
          console.log(this.selectedTeam);
          console.log(res);
        },
        err=>{
          console.log(err);
          return false;
        });
  }
     
  selectMember(index){
    this.teamService.getMemberbyUsername(this.team.team_members[index].username).subscribe( res => {
          this.user = res.user;
          this.selectedMember = index; 
          console.log(res.user);
        },
        err=>{
          console.log(err);
          return false;
        });
  }

    selectLeader(index){
    this.teamService.getMemberbyUsername(this.team.team_leaders[index].username).subscribe( res => {
          this.user = res.user;
          this.selectedLeader = index;
          console.log(res);
        },
        err=>{
          console.log(err);
          return false;
        });
  }

  // Add a member to a Team
  addMember(event: Event){
    event.preventDefault();
    this.teamService.getMemberbyUsername(this.username).subscribe( res => {
          if(res.success){
            if((this.team.team_members.map(function(e) { return e.username; }).indexOf(res.user.username) > -1)
                  || (this.team.team_leaders.map(function(e) { return e.username; }).indexOf(res.user.username) > -1)){
              this.toastr.error('User with a same username already exists in this team')
            }else{
            this.teamService.addMember(res.user._id, this.team._id).subscribe(data =>{
              if (data.success){
                console.log(this.selectedMember);
                this.selectedMember = this.team.team_members.length-1;
                this.team.team_members.push(data.user);
                this.toastr.clear();
                this.toastr.success(data.user.name +" has been successfully added to "+data.team.team_name);
                this.username='';
              }else{
                this.toastr.clear();
                this.toastr.error("Oops, it seems you need to try again");
              }
            })
          }}
          else{
            this.toastr.error('User not found with that username')
          }},err=>{return false;});
  }

  // Add a leader to a Team
  addLeader(event: Event){
    event.preventDefault();
    this.teamService.getMemberbyUsername(this.user_name).subscribe( res => {
          if(res.success){
            if((this.team.team_leaders.map(function(e) { return e.username; }).indexOf(res.user.username) > -1)){
                    this.toastr.error('User with a same username already exists in this team')
            }else{
              if((this.team.team_members.map(function(e) { return e.username; }).indexOf(res.user.username) > -1)){
                // The member is in team members, we need to graduate him
                this.teamService.graduateMember(res.user._id, this.team._id).subscribe(data =>{
                if (data.success){
                  this.team.team_members.splice(this.teams[this.selectedTeam].team.team_members.indexOf(data.user._id),1);
                  this.team.team_leaders.push(data.user);
                  this.toastr.success('User transferred from member to leader');
                }else{
                  this.toastr.error('Oops, we encountred an error while adding leader');                  
                }
                })
              }else{
              this.teamService.addLeader(res.user._id, this.team._id).subscribe(data =>{
                if (data.success){
                  console.log(this.selectedMember);
                  this.selectedMember = this.team.team_leaders.length-1;
                  this.team.team_leaders.push(data.user);
                  this.toastr.clear();
                  this.toastr.success(data.user.name +" has been successfully added to "+data.team.team_name+" as a leader");
                  this.user_name='';
                }else{
                  this.toastr.clear();
                  this.toastr.error("Oops, it seems you need to try again");
                }
              })}
            }}
          else{
            this.toastr.error('User not found with that username')
          }},err=>{return false;});
  }

  //Add a team to the list
  addTeam(event: Event){
    event.preventDefault();
    const newTeam = {
        "team_name": this.team_name,
        "team_info": this.team_info,
        "user_id": this.user._id
      }      
      this.teamService.addTeam(newTeam).subscribe(data =>{
      if (data.success){
        this.user.teams.push({
          leader: true,
          team:data.team
        });
        this.teams = this.teamService.getValidTeams(this.user.teams) ;;
        this.selectedTeam = this.teams.length-1;
        this.team = data.team;
        this.team.team_leaders[0] = this.user;
        this.toastr.clear();
        console.log('debu1');
        console.log(this.selectedTeam);
        console.log(this.teams);
        this.toastr.success(data.team.team_name+" has been successfully created");
        this.team_name='';
        this.team_info='';
      }else{
        this.toastr.clear();
        this.toastr.error("Somthing went wrong with the creation of the team.");
  }
    })

  }

  //Remove member from a team
  removeMember(event: Event){
    event.preventDefault();
    const newObject = {
      "member_id": this.team.team_members[this.selectedMember]._id,
      "team_id": this.team._id
    }
    this.teamService.removeMember(newObject).subscribe(data =>{
      if (data.success){
        this.toastr.clear();
        this.toastr.success(data.user.name +" has been successfully removed from "+data.team.team_name);
        this.team.team_members.splice(this.selectedMember,1);
      }else{
        this.toastr.clear();
        this.toastr.error("Somthing went wrong while removing member.");
  }
    })
  }

  //Remove Leader from a team
  removeLeader(event: Event){
    event.preventDefault();
    const newObject = {
      "leader_id": this.team.team_leaders[this.selectedLeader]._id,
      "team_id": this.team._id
    }
    this.teamService.removeLeader(newObject).subscribe(data =>{
      if (data.success){
        this.toastr.clear();
        this.toastr.success(data.user.name +" has been successfully removed from "+data.team.team_name);
        this.team.team_leaders.splice(this.selectedLeader,1);
      }else{
        this.toastr.clear();
        this.toastr.error("Somthing went wrong while removing member.");
  }
    })
  }  

  //Remove Team 
  removeTeam(event: Event){
    event.preventDefault();
    this.teamService.removeTeam(this.team._id).subscribe(data =>{
      if (data.success){
        console.log(this.user.teams);
        console.log(this.selectedTeam);
        this.user.teams = this.teamService.getValidTeams(this.user.teams)
        this.user.teams.splice(this.selectedTeam, 1);
        this.teams=this.user.teams;
        console.log(this.teams);
        this.teamService.getUserTeam(this.user.teams[0].team._id).subscribe( res => {
          console.log('debug');
          console.log(res);
          this.team = res.team;
        },
        err=>{
          console.log(err);
          return false;
        });
        this.toastr.success("Team has been successfully removed!");
      }else{
        this.toastr.error("Somthing went wrong while removing team.");    
      }

    })
  }

  editTeam(event: Event){
    event.preventDefault();
    this.teamService.editTeam(this.team._id, this.new_team_name,this.new_team_info).subscribe(data =>{
      if(data.success){
        this.team.team_name=this.new_team_name;
        this.team.team_info=this.new_team_info;  
        this.user.teams=this.teamService.getValidTeams(this.user.teams);
        this.user.teams[this.selectedTeam].team=this.team;
        this.teamService.getUserTeam(this.user.teams[this.selectedTeam].team._id).subscribe( res => {
          this.team = res.team;
        },
        err=>{
          console.log(err);
          return false;
        });      
        this.toastr.clear();
        this.toastr.success("The team has been successfully updated ");
        this.new_team_name='';
        this.new_team_info='';
      }else{
        this.toastr.clear();
        this.toastr.error("Oops, it seems you need to try again");
      }
    })
  }
  
  isLeader(){
    return (this.teams[this.selectedTeam].team.team_leaders.indexOf(this.auth_user._id) != -1)
  }
}   



