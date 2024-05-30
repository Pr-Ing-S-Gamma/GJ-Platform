import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./global-sites.component.css']
})

export class GlobalSitesComponent implements OnInit {
  regionParameter: string | undefined;
  siteParameter: string | undefined;
  inSite: boolean = false;
  dataSource: { [key: string]: any[] } = {};
  regions: Region[] = [];
  staff: User[] = [];
  games: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private userService: UserService,
    private regionService: RegionService
  ) {}

  ngOnInit(): void {
    this.regionService.getRegions('http://localhost:3000/api/region/get-regions').subscribe(
      regions => {
        this.regions = regions;
        this.getSitesAndMergeData();
      },
      error => {
        console.error('Error al obtener regiones:', error);
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

  getSitesAndMergeData(): void {
    this.siteService.getSites(`http://localhost:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`).subscribe(
      sites => {
        this.dataSource = this.transformSitesData(sites);
      },
      error => {
        console.error('Error al obtener sitios:', error);
      }
    );
  }

  transformSitesData(sites: Site[]): { [key: string]: any[] } {
    const groupedSites: { [key: string]: any[] } = {};

    sites.forEach(site => {
      const { name, region, country } = site;
      const regionName = region.name;

      if (!groupedSites[regionName]) {
        groupedSites[regionName] = [];
      }

      groupedSites[regionName].push({ country: country.name, name });
    });

    this.regions.forEach(region => {
      if (!groupedSites[region.name]) {
        groupedSites[region.name] = [];
      }
    });

    return groupedSites;
  }

  moveToRegionsRoot(): void {
    this.regionParameter = 'Regions';
    this.inSite = false;
  }

  moveToRegionSites(region: string | undefined): void {
    if (region === undefined) {
      this.regionParameter = 'Regions';
    }
    this.regionParameter = region;
    this.inSite = false;
  }

  moveToSiteInformation(site: string): void {
    this.inSite = true;
    this.siteParameter = site;
    const url = `http://localhost:3000/api/user/get-site-staff/${this.regionParameter}/${this.siteParameter}`;

    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.staff = users.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          region: user.region,
          site: user.site,
          roles: user.roles,
          coins: user.coins,
          discordUsername: user.discordUsername
        }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
}
