import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SubmissionService } from '../services/submission.service';
import { GameInformationComponent } from '../game-information/game-information.component';
import { Site, Submission, Team, User } from '../../types';
import { SiteService } from '../services/site.service';
import { forkJoin } from 'rxjs';
import { TeamService } from '../services/team.service';
import { GamejamService } from '../services/gamejam.service';

@Component({
  selector: 'app-juez-main',
  standalone: true,
  imports: [
    CommonModule,
    GameInformationComponent
  ],
  templateUrl: './juez-main.component.html',
  styleUrl: './juez-main.component.css'
})
export class JuezMainComponent implements OnInit {
  games: any[] = []
  evaluations: any[] = []
  userId!: String | undefined
  selectedGame: string = ''
  gameInfoModal: string = "gameInfoModal";
  isHovered: boolean = false;
  targetTime: Date | undefined;
  timeRemaining: string | undefined;

  constructor(private router: Router, private userService: UserService, private SubmissionService: SubmissionService, private TeamService: TeamService, private GameJamService: GamejamService){}

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      user => {
        this.userId = user._id;
        const url = `http://localhost:3000/api/submission/get-submissions-evaluator/${this.userId}`;
        this.GameJamService.getTimeRemainingData('http://localhost:3000/api/game-jam/get-time-left-evaluator')
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
        this.SubmissionService.getSubmissionsEvaluator(url).subscribe(
          (juegos: Submission[]) => {
            for (const juego of juegos){
              const urlj = 'http://localhost:3000/api/team/get-team/' + juego.teamId
              this.TeamService.getTeamById(urlj).subscribe(
                (team: Team) => {
                  this.games.push(
                    {
                      id: juego._id,
                      name: juego.title,
                      team: team.studioName
                    }
                  );
                },
                error => {
                  console.error('Error al obtener juegos:', error);
                }
              )
            }
          },
          error => {
            console.error('Error al obtener juegos:', error);
          }
        );
        const url1 = `http://localhost:3000/api/submission/get-ratings-evaluator/${this.userId}`;
        this.SubmissionService.getSubmissionsEvaluator(url1).subscribe(
          (juegos: Submission[]) => {
            for (const juego of juegos){
              const urlj = 'http://localhost:3000/api/team/get-team/' + juego.teamId
              this.TeamService.getTeamById(urlj).subscribe(
                (team: Team) => {
                  this.evaluations.push(
                    {
                      id: juego._id,
                      name: juego.title,
                      team: team.studioName
                    }
                  );
                },
                error => {
                  console.error('Error al obtener juegos:', error);
                }
              )
            }
          },
          error => {
            console.error('Error al obtener juegos:', error);
          }
        );
      },
      error => {
        console.error('Error al obtener usuario actual:', error);
      }
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

  selectGame(id: string){
    this.selectedGame = id
  }

  getNewEvaluation() {
    this.SubmissionService.getCurrentTeamSubmission(`http://localhost:3000/api/submission/get-new-evaluation`).subscribe(
      (juego: Submission) => {
        const existingGame = this.games.find(game => game.id === juego._id);
        if (existingGame) {
          return; 
        }
  
        const urlj = 'http://localhost:3000/api/team/get-team/' + juego.teamId
        this.TeamService.getTeamById(urlj).subscribe(
          (team: Team) => {
            this.games.push(
              {
                id: juego._id,
                name: juego.title,
                team: team.studioName
              }
            );
          },
          error => {
            console.error('Error al obtener juegos:', error);
          }
        )
      },
      error => {
        console.error('Error al obtener juegos:', error);
      }
    );
  }
  
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
      this.timeRemaining = '0d 0h 0m 0s';
    }
  }
  
}
