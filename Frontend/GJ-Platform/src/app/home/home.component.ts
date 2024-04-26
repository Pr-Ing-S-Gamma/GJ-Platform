import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { LocalSiteInformationComponent } from '../local-site-information/local-site-information.component';
import { JammerHomeComponent } from '../jammer-home/jammer-home.component';
import { JuezMainComponent } from '../juez-main/juez-main.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LocalSiteInformationComponent,
    JammerHomeComponent,
    JuezMainComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  localLogged: boolean = false;
  constructor(private router: Router, private userService: UserService, private siteService: SiteService){}

  logOut(){
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
