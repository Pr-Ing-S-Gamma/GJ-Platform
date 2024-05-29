import { Component, OnInit} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../services/site.service';
import { RegionService } from '../services/region.service';
import { Site, User, Region } from '../../types';
import { UserService } from '../services/user.service';
import { GameInformationComponent } from '../game-information/game-information.component';

@Component({
  selector: 'app-global-sites',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './global-sites.component.html',
  styleUrl: './global-sites.component.css'
})

export class GlobalSitesComponent implements OnInit{
  regionParameter: String | undefined;
  siteParameter: String | undefined;
  inSite: boolean = false;
  dataSource: Site[] = [];
  regions: any[] = []; 
  staff: User[] = [];
  games: any[] = []
  constructor(private router: Router, private route: ActivatedRoute, private siteService: SiteService, private userService: UserService, private regionService: RegionService) { }

  moveToRegionsRoot(){
    this.regionParameter = 'Regions';
    this.inSite = false;
  }

  moveToRegionSites(region: String | undefined){
    if (region === undefined){
      this.regionParameter = 'Regions';
    }
    this.regionParameter = region;
    this.inSite = false;
  }

  moveToSiteInformation(site: String){
    this.inSite = true;
    this.siteParameter = site;
    const url = `http://localhost:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`;

    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.staff = users.map(user => ({ _id: user._id, name: user.name, email: user.email, region: user.region, site: user.site, roles: user.roles, coins: user.coins, discordUsername: user.discordUsername }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
    //this.siteService.getSubmissions('http://localhost:3000/api/site/get-submissions-site/' + site).subscribe()
  }
  
  ngOnInit(): void { /*
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      user => {
        if (user.rol === 'LocalOrganizer') {
          this.router.navigate(['/Games']);
          return; 
        }
        if (user.rol === 'Jammer') {
          this.router.navigate(['/Jammer']);
          return; 
        }
      },/*
      error => {
        this.router.navigate(['/login']);
      }
    ); */
    this.siteService.getSites('http://localhost:3000/api/site/get-sites')
      .subscribe(
        sites => {
          this.dataSource = sites;
          this.transformSitesData();
        },
        error => {
          console.error('Error al obtener países:', error);
        }
      );
    this.route.params.subscribe(params => {
      if (params['region']) {
        this.regionParameter = params['region'];
      } else {
        this.regionParameter = 'Regions';
      }
    });
  }

  transformSitesData(): void {
    const groupedSites: { [key: string]: any[] } = {};

    this.dataSource.forEach(site => {
      const { name, region, country } = site;
      const regionName = region.name;

      if (!groupedSites[regionName]) {
        groupedSites[regionName] = [];
      }

      groupedSites[regionName].push({ country: country.name, name });
    });

    /*this.regions = Object.keys(groupedSites).map(regionName => ({
      name: regionName,
      sites: groupedSites[regionName]
    }));*/

    this.regionService.getRegions('http://localhost:3000/api/region/get-regions').subscribe(
      (regionss: Region[]) => {
        this.regions = regionss; 
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }

}
