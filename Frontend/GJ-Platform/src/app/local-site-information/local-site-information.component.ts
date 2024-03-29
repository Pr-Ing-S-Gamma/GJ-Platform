import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';

@Component({
  selector: 'app-local-site-information',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './local-site-information.component.html',
  styleUrl: './local-site-information.component.css'
})
export class LocalSiteInformationComponent {
  site = 'Zapote'
  
  games = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]

  logOut(){
    console.log("OH MY GOD")
  }
}
