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

  constructor(private router: Router, private userService: UserService, private SubmissionService: SubmissionService, private TeamService: TeamService){}

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      user => {
        this.userId = user._id;
        const url = `http://localhost:3000/api/submission/get-submissions-evaluator/${this.userId}`;
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
            
            /*
            this.games = juegos.map(submission => ({
               _id: submission._id, name: submission.name, team: submission.teamId 
              }));
            */
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
            
            /*
            this.evaluations = juegos.map(submission => ({
               _id: submission._id, name: submission.name, team: submission.teamId 
              }));
            */
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

  /*
  games = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]  

  evaluations = [
    {id:1, name: 'Bloom Tales', team: 'Outlander studio'},
    {id:2, name: 'Space Pinbam', team: 'Flipper Studio'}
  ]
  */

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

  trackById(index: number, game: any): any {
    return game.id;
  }
}
