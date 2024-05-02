import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SubmissionService } from '../services/submission.service';
import { TeamService } from '../services/team.service';
import { Team, Submission } from '../../types';

@Component({
  selector: 'app-juez-main',
  templateUrl: './juez-main.component.html',
  styleUrls: ['./juez-main.component.css']
})
export class JuezMainComponent implements OnInit {
  games: any[] = [];
  evaluations: any[] = [];
  userId!: string | undefined;
  selectedGame: string = '';
  gameInfoModal: string = "gameInfoModal";

  constructor(
    private router: Router,
    private userService: UserService,
    private submissionService: SubmissionService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user').subscribe(
      user => {
        this.userId = user._id;
        const submissionsEvaluatorUrl = `http://localhost:3000/api/submission/get-submissions-evaluator/${this.userId}`;
        const ratingsEvaluatorUrl = `http://localhost:3000/api/submission/get-ratings-evaluator/${this.userId}`;

        this.submissionService.getSubmissionsEvaluator(submissionsEvaluatorUrl).subscribe(
          (games: Submission[]) => {
            this.processGames(games);
          },
          error => {
            console.error('Error al obtener juegos:', error);
          }
        );

        this.submissionService.getSubmissionsEvaluator(ratingsEvaluatorUrl).subscribe(
          (evaluations: Submission[]) => {
            this.processEvaluations(evaluations);
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

  processGames(games: Submission[]): void {
    for (const game of games) {
      const teamUrl = `http://localhost:3000/api/team/get-team/${game.teamId}`;
      this.teamService.getTeamById(teamUrl).subscribe(
        (team: Team) => {
          this.games.push({
            id: game._id,
            name: game.title,
            team: team.studioName
          });
        },
        error => {
          console.error('Error al obtener juegos:', error);
        }
      );
    }
  }

  processEvaluations(evaluations: Submission[]): void {
    for (const evaluation of evaluations) {
      const teamUrl = `http://localhost:3000/api/team/get-team/${evaluation.teamId}`;
      this.teamService.getTeamById(teamUrl).subscribe(
        (team: Team) => {
          this.evaluations.push({
            id: evaluation._id,
            name: evaluation.title,
            team: team.studioName
          });
        },
        error => {
          console.error('Error al obtener juegos:', error);
        }
      );
    }
  }

  logOut(): void {
    this.userService.logOutUser('http://localhost:3000/api/user/log-out-user').subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }

  selectGame(id: string): void {
    this.selectedGame = id;
  }
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
