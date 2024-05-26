import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameInformationComponent } from '../game-information/game-information.component';
import { User } from '../../types';
import { UserService } from '../services/user.service';

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
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }
  staff: User[] = [];

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
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      user => {
        if (user.roles.includes('LocalOrganizer')) {
          this.router.navigate(['/Games']);
        }
        if (user.roles.includes('GlobalOrganizer')) {
          this.router.navigate(['/DataManagement']);
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
    const url = `http://localhost:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`;
    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.staff = users.map(user => ({ _id: user._id, name: user.name, email: user.email, region: user.region, site: user.site, roles: user.roles, coins: user.coins, discordUsername: user.discordUsername }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  games = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]

}
