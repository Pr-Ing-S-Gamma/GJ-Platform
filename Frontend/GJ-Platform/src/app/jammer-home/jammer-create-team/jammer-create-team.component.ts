import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user.service';
import { SiteService } from '../../services/site.service';
import { GamejamService } from '../../services/gamejam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jammer-create-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './jammer-create-team.component.html',
  styleUrls: ['./jammer-create-team.component.css']
})
export class JammerCreateTeamComponent implements OnInit{
  myForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private teamService: TeamService, private siteService: SiteService, private gamejamService: GamejamService){
  }
  username: string | undefined;
  ngOnInit(): void {
    this.myForm = this.fb.group({
      studioName: ['', Validators.required],
      description: ['', Validators.required],
      gameJam: ['', Validators.required],
      site: ['', Validators.required],
      region: ['', Validators.required]
    });
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
      .subscribe(
        user => {
          if (user.rol === 'LocalOrganizer') {
            this.router.navigate(['/Games']);
          }
          if (user.rol === 'GlobalOrganizer') {
            this.router.navigate(['/DataManagement']);
          }
          if(user.team?.name) {
            this.router.navigate(['/Jammer']);
          }
          this.username = user.name + "(" + user.discordUsername + ")";
          this.myForm.get('site')?.setValue(user.site);
          this.myForm.get('region')?.setValue(user.region);
          this.gamejamService.getCurrentGameJam('http://localhost:3000/api/game-jam/get-current-game-jam')
            .subscribe(
              gameJam => {
                this.myForm.get('gameJam')?.setValue(gameJam);
              },
              () => {}
            );
        },
        () => {}
      );
  }
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

  createTeam() {
    if (this.myForm.valid) {
      const { studioName, description, gameJam, site, region } = this.myForm.value;
      this.userService.getCurrentUser('http://localhost:3000/api/user/get-user').subscribe(
        user => {
          const currentUser = {
            _id: user._id || '',
            name: user.name,
            email: user.email,
            discordUsername: user.discordUsername
          };
  
          this.teamService.createTeam(`http://localhost:3000/api/team/create-team`, {
            studioName: studioName,
            description: description,
            gameJam: {
              _id: gameJam._id,
              edition: gameJam.edition
            },
            linkTree: [],
            jammers: [currentUser], 
            site: {
              _id: site._id,
              name: site.name
            },
            region: {
              _id: region._id,
              name: region.name
            }
          }).subscribe({
            next: (data) => {
              alert('Guardado con éxito');
              this.router.navigate(['/Jammer']).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              console.error('Error creating team:', error);
            }
          });
        },
        error => {
          console.error('Error retrieving current user:', error);
        }
      );
    } else {
    }
  }
}
