import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';
import { UserService } from '../services/user.service';
import { Site, User } from '../../types';
import { SiteService } from '../services/site.service';

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
export class LocalSiteInformationComponent implements OnInit{
  constructor(private router: Router, private userService: UserService, private siteService: SiteService){}
  site: Site | undefined;
  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      () => {
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
      .subscribe(
        user => {
          this.siteService.getSite(`http://localhost:3000/api/site/get-site/${user.site._id}`)
            .subscribe(
              site => {
                this.site = site;
              },
              error => {
                console.error('Error al obtener el sitio del usuario:', error);
              }
            );
        },
        error => {
          console.error('Error al obtener usuario actual:', error);
        }
      );
  }

  games = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]

  logOut(): void {
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
