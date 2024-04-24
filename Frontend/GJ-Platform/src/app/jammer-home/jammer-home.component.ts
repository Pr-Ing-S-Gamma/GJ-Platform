import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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


}
