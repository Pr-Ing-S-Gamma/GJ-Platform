import { Component, OnInit} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../services/site.service';
import { Site } from '../../types';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-global-sites',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './global-sites.component.html',
  styleUrl: './global-sites.component.css'
})

export class GlobalSitesComponent implements OnInit{
  regionParameter: String | undefined;
  dataSource: Site[] = [];
  regions: any[] = []; 
  constructor(private router: Router, private route: ActivatedRoute, private siteService: SiteService, private userService: UserService) { }

  moveToCruds() {
    this.router.navigate(['/DataManagement']);
  }

  moveToRegionsRoot(){
    this.router.navigate(['/Sites']);
  }

  moveToRegionSites(region: String){
    this.router.navigate(['/Sites', region]);
  }

  moveToSiteInformation(site: String){
    this.router.navigate(['/Sites', this.regionParameter, 'Information', site]);
  }
  
  ngOnInit(): void {
    this.userService.getCurrentUser('http://149.130.176.112:3000/api/user/get-user')
    .subscribe(
      user => {
        if (user.rol === 'LocalOrganizer') {
          this.router.navigate(['/Games']);
          return; 
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
    this.siteService.getSites('http://149.130.176.112:3000/api/site/get-sites')
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

    this.regions = Object.keys(groupedSites).map(regionName => ({
      name: regionName,
      sites: groupedSites[regionName]
    }));
  }

  logOut(): void {
    this.userService.logOutUser('http://149.130.176.112:3000/api/user/log-out-user')
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
