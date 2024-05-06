import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';
import { UserService } from '../services/user.service';
import { Site, User } from '../../types';
import { SiteService } from '../services/site.service';
import { UploadCsvComponent } from '../upload-csv/upload-csv.component';

@Component({
  selector: 'app-local-site-information',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent,
    UploadCsvComponent
  ],
  templateUrl: './local-site-information.component.html',
  styleUrl: './local-site-information.component.css'
})
export class LocalSiteInformationComponent implements OnInit{
  constructor(private router: Router, private userService: UserService, private siteService: SiteService){}
  site: Site | undefined;
  currentStatus: string = "";
  games: any[] = [];

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
      .subscribe(
        user => {
          this.siteService.getSite(`http://localhost:3000/api/site/get-site/${user.site._id}`)
            .subscribe(
              site => {
                this.site = site;
                if (site.open == 0) {
                  this.currentStatus = "Open";
                } else {
                  this.currentStatus = "Closed";
                }
              },
              error => {
                console.error('Error al obtener el sitio del usuario:', error);
              }
            );

          this.siteService.getSubmissions(`http://localhost:3000/api/submission/get-submissions-site/${user.site._id}`)
            .subscribe(
              submissions  => {
                this.games = submissions;
              },
              error => {
                console.error('Error al obtener las entregas:', error);
              }
            );
        },
        error => {
          console.error('Error al obtener usuario actual:', error);
        }
      );
  }


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
