<<<<<<< HEAD
<<<<<<< HEAD
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { GamejamService } from '../services/gamejam.service';
import { Router } from '@angular/router';
>>>>>>> 74ca8507796909233202de2917afd92b46e0970f
=======
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
>>>>>>> parent of 74ca850 (GJP-65 Ventanas faltantes)

@Component({
  selector: 'app-jammer-home',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CommonModule
  ],
  templateUrl: './jammer-home.component.html',
  styleUrl: './jammer-home.component.css'
})
<<<<<<< HEAD
<<<<<<< HEAD
export class JammerHomeComponent {
  showTeam: boolean = false;
  constructor(private router: Router, private userService: UserService) { }

  moveToSites() {
    this.router.navigate(['/Sites']);
  }

  private hide(){
    this.showTeam = false;

  }

  toggleTeam() {
    this.hide();
    this.showTeam = true;
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

  a(){
    console.log("aa")
  }

=======
export class JammerHomeComponent implements OnInit {
  targetTime: Date | undefined;
  timeRemaining: string | undefined;
  username: string | undefined;
  teamName: string | undefined;
  isHovered: boolean = false;
>>>>>>> 74ca8507796909233202de2917afd92b46e0970f
=======
export class JammerHomeComponent {
>>>>>>> parent of 74ca850 (GJP-65 Ventanas faltantes)

}
