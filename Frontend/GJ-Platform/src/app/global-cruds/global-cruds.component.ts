import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RegionCRUDComponent } from './region-crud/region-crud.component';
import { SiteCrudComponent } from './site-crud/site-crud.component';
import { CategoryCrudComponent } from './category-crud/category-crud.component';
import { TeamCrudComponent } from './team-crud/team-crud.component';
import { StageCrudComponent } from './stage-crud/stage-crud.component';
import { GamejamCrudComponent } from './gamejam-crud/gamejam-crud.component';
import { UserCrudComponent } from './user-crud/user-crud.component';
import { ThemeCrudComponent } from './theme-crud/theme-crud.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-global-cruds',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CommonModule,
    StageCrudComponent,
    RegionCRUDComponent,
    SiteCrudComponent,
    CategoryCrudComponent,
    TeamCrudComponent,
    ThemeCrudComponent,
    UserCrudComponent,
    GamejamCrudComponent
  ],
  templateUrl: './global-cruds.component.html',
  styleUrl: './global-cruds.component.css'
})
export class GlobalCRUDsComponent implements OnInit{
  showRegions: boolean = false;
  showSites: boolean = false;
  showCategories : boolean = false;
  showThemes  : boolean = false;
  showTeams  : boolean = false;
  showStage  : boolean = false;
  showUser  : boolean = false;
  showJam  : boolean = false;
  constructor(private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getCurrentUser('http://149.130.176.112:3000/api/user/get-user')
    .subscribe(
      user => {
        if (user.rol === 'LocalOrganizer') {
          this.router.navigate(['/Games']);
        }
      },
      () => {
      }
    );
  }
  moveToSites() {
    this.router.navigate(['/Sites']);
  }

  private hideAll() {
    this.showRegions = false;
    this.showSites = false;
    this.showCategories = false;
    this.showThemes = false;
    this.showTeams = false;
    this.showStage = false;
    this.showUser = false;
    this.showJam = false;
  }
toggleRegions() {
  this.hideAll();
  this.showRegions = true;
}

toggleSites() {
  this.hideAll();
  this.showSites = true;
}

toggleCategories() {
  this.hideAll();
  this.showCategories = true;
}

toggleThemes() {
  this.hideAll();
  this.showThemes = true;
}

toggleTeams() {
  this.hideAll();
  this.showTeams = true;
}

toggleStage() {
  this.hideAll();
  this.showStage = true;
}

toggleUser() {
  this.hideAll();
  this.showUser = true;
}

toggleJam() {
  this.hideAll();
  this.showJam = true;
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
