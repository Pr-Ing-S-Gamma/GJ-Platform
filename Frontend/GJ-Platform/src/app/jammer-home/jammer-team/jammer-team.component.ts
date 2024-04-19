import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jammer-team',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './jammer-team.component.html',
  styleUrl: './jammer-team.component.css'
})
export class JammerTeamComponent {

  members = [
    {id:1, name:'David Pastor Barrientos', discord:'Aldokler', email:'xdavidpastor@gmail.com'},
    {id:2, name:'Atlas09 Herrera', discord:'Adrian', email:'maenomesesucorreo@gmail.com'},
  ]

  toggleAddMember(){
    //Do something!
  }

  leaveTeam(){
    //Do something!
  }
}
