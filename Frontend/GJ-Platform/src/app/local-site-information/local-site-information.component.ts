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
  site: Site = {
    name: 'Zapotillo',
    region: {
      _id: '',
      name: ''
    },
    country: {
      name: '',
      code: ''
    }
  }; 
  currentStatus: string = "";
  games: any[] = [];
  inSubmissions: boolean = true; //0
  inTeams: boolean = false;      //1
  inJammers: boolean = false;    //2
  inStaff: boolean = false;      //3
  inManagement: boolean = false; //4
  actualWindow: number = 0;

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

  moveToSubmissions(){
    if (!this.inSubmissions && this.actualWindow != 0){
      this.inSubmissions = !this.inSubmissions;
      switch (this.actualWindow){
        case 1:
          this.inTeams = !this.inTeams;
          break;
        case 2:
          this.inJammers = !this.inJammers;
          break;
        case 3:
          this.inStaff = !this.inStaff;
          break;
        case 4:
          this.inManagement = !this.inManagement;
          break;
      }
      this.actualWindow = 0;
    }
  }

  moveToTeams(){
    if (!this.inTeams && this.actualWindow != 1){
      this.inTeams = !this.inTeams;
      switch (this.actualWindow){
        case 0:
          this.inSubmissions = !this.inSubmissions;
          break;
        case 2:
          this.inJammers = !this.inJammers;
          break;
        case 3:
          this.inStaff = !this.inStaff;
          break;
        case 4:
          this.inManagement = !this.inManagement;
          break;
      }
      this.actualWindow = 1;
    }
  }

  moveToJammers(){
    if (!this.inJammers && this.actualWindow != 2){
      this.inJammers = !this.inJammers;
      switch (this.actualWindow){
        case 0:
          this.inSubmissions = !this.inSubmissions;
          break;
        case 1:
          this.inTeams = !this.inTeams;
          break;
        case 3:
          this.inStaff = !this.inStaff;
          break;
        case 4:
          this.inManagement = !this.inManagement;
          break;
      }
      this.actualWindow = 2;
    }
  }

  moveToStaff(){
    if (!this.inStaff && this.actualWindow != 3){
      this.inStaff = !this.inStaff;
      switch (this.actualWindow){
        case 0:
          this.inSubmissions = !this.inSubmissions;
          break;
        case 1:
          this.inTeams = !this.inTeams;
          break;
        case 2:
          this.inJammers = !this.inJammers;
          break;
        case 4:
          this.inManagement = !this.inManagement;
          break;
      }
      this.actualWindow = 3;
    }
  }

  moveToManagement(){
    if (!this.inManagement && this.actualWindow != 4){
      this.inManagement = !this.inManagement;
      switch (this.actualWindow){
        case 0:
          this.inSubmissions = !this.inSubmissions;
          break;
        case 1:
          this.inTeams = !this.inTeams;
          break;
        case 2:
          this.inJammers = !this.inJammers;
          break;
        case 3:
          this.inStaff = !this.inStaff;
          break;
      }
      this.actualWindow = 4;
    }
  }
}
