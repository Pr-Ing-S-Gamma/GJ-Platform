import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GameInformationComponent } from '../game-information/game-information.component';
import { Site, User } from '../../types';
import { SiteService } from '../services/site.service';

@Component({
  selector: 'app-juez-main',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './juez-main.component.html',
  styleUrl: './juez-main.component.css'
})
export class JuezMainComponent {
  constructor(private router: Router, private userService: UserService, private siteService: SiteService){}

  games = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]  

  evaluations = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]

  logOut(){
    this.userService.logOutUser('http://localhost:3000/api/user/log-out-user')
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al cerrar sesión:', error);
        }
      );
  }
}
