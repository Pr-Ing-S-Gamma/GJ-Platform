import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';
import { GamejamService } from '../../services/gamejam.service';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-jammer-submit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './jammer-submit.component.html',
  styleUrls: ['./jammer-submit.component.css']
})
export class JammerSubmitComponent implements OnInit{
  myForm!: FormGroup;
  //cambiar a las categorias y temas del gamejam
  gjThemes : string[]= ["Aliados inesperados", "Enemigos dificiles", "Protagonista carismatico"];
  gjCategories : string [] =["Shooter", "RPG", "GACHA"];
  selectedTheme: string | null = null;
  selectedCategory: string | null = null;
  targetTime: Date | undefined;
  timeRemaining: string | undefined;
  username: string | undefined;
  teamName: string | undefined;
  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private teamService: TeamService, private siteService: SiteService, private gamejamService: GamejamService){
  }
ngOnInit(): void {
  this.myForm = this.fb.group({
    itchio: ['', Validators.required],
    pitch: ['', Validators.required],
    game: ['', Validators.required],
    theme: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required]
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
          this.username = user.name + "(" + user.discordUsername + ")";
          this.teamName = user.team?.name;
          this.gamejamService.getTimeRemainingData('http://localhost:3000/api/game-jam/get-time-left')
            .subscribe(
              timeLeft => {
                const timeParts = timeLeft.split(':').map((part: string) => parseInt(part, 10));
  
                if (timeParts.length !== 4 || timeParts.some(isNaN)) {
                  console.error("Invalid target time format");
                  return;
                }
  
                const [days, hours, minutes, seconds] = timeParts;
  
                const totalMilliseconds =
                  (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  
                this.targetTime = new Date(Date.now() + totalMilliseconds);
  
                if (this.targetTime instanceof Date) {
                  setInterval(() => {
                    this.updateTimer();
                  }, 1000);
                } else {
                  console.error("Invalid target time format");
                }
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

  selectTheme(theme: string): void {
    this.selectedTheme = theme;
  }
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  submitGame(){}

  updateTimer() {
    const now = new Date();
  
    if (this.targetTime instanceof Date) {
      const difference = this.targetTime.getTime() - now.getTime();
  
      if (difference <= 0) {
        this.timeRemaining = '0d 0h 0m 0s';
        return;
      }
  
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      let timeRemainingStr = '';
      if (days > 0) {
        timeRemainingStr += `${days}d `;
      }
      if (hours > 0) {
        timeRemainingStr += `${hours}h `;
      }
      if (minutes > 0) {
        timeRemainingStr += `${minutes}m `;
      }
      if (seconds > 0) {
        timeRemainingStr += `${seconds}s`;
      }
  
      this.timeRemaining = timeRemainingStr.trim();
    } else {
      this.timeRemaining = 'Target time not set';
    }
  }  
}

