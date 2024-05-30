import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';
import { User } from '../../types';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment.prod';
import { SiteService } from '../services/site.service';

@Component({
  selector: 'app-global-site-information',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './global-site-information.component.html',
  styleUrl: './global-site-information.component.css'
})

export class GlobalSiteInformationComponent {
  regionParameter!: String;
  siteParameter!: String;
  constructor(private router: Router, private siteService: SiteService,private route: ActivatedRoute, private userService: UserService) { }
  staff: User[] = [];
  games: any[] = [];

  moveToCruds() {
    this.router.navigate(['/DataManagement']);
  }

  moveToRegionSites(region: String){
    this.router.navigate(['/Sites', region]);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.regionParameter = params['region'];
      this.siteParameter = params['site'];
    });
    this.userService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
    .subscribe(
      user => {
        if (user.roles.includes('LocalOrganizer')) {
          this.router.navigate(['/Games']);
        }
        if (user.roles.includes('GlobalOrganizer')) {
          this.router.navigate(['/DataManagement']);
        }
          this.siteService.getSubmissions(`http://${environment.apiUrl}:3000/api/submission/get-submissions-site/${this.siteParameter}`)
            .subscribe(
              submissions => {
                this.games = submissions;
                console.log(this.games);
              },
              error => {
                console.error('Error al obtener las entregas:', error);
              }
            );
        
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
    const url = `http://${environment.apiUrl}:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`;
    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.staff = users.map(user => ({ _id: user._id, name: user.name, email: user.email, region: user.region, site: user.site, roles: user.roles, coins: user.coins, discordUsername: user.discordUsername }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
    
  }
  
}
