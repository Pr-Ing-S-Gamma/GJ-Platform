import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../services/submission.service';
import { RateFormComponent } from './rate-form/rate-form.component';
import { Submission, Team, Theme, Category } from '../../types';
import { TeamService } from '../services/team.service';
import { ThemeService } from '../services/theme.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-game-information',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RateFormComponent
  ],
  templateUrl: './game-information.component.html',
  styleUrl: './game-information.component.css'
})
export class GameInformationComponent implements OnInit {
  @Input() game!: string;
  gameParameter!: string;
  ActualUserIsJuez: Boolean = false;
  evaluando: Boolean = false;
  dataSource: any = {
    name: '',
    team: '',
    description: '',
    teamMembers: [],
    themes: [],
    categories: [],
    gameLink: '',
    pitchLink: ''
  };
  gameTitle: string = '';
  teamName: string = '';
  gameDescription: string = '';
  teamMembers: { name: string; discordUsername: string; email: string; }[] = [];
  themes: string[] = [];
  categories: string[] = [];
  gameLink: string = '';
  pitchLink: string = '';
  @Input()id : Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private SubmissionService: SubmissionService, 
    private TeamService: TeamService, 
    private ThemeService: ThemeService, 
    private CategoryService: CategoryService,
    private UserService: UserService
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.UserService.getCurrentUser(`http://${environment.apiUrl}:3000/api/user/get-user`)
      .subscribe(
        user => {
          if (user.roles.includes('Judge')) {
            this.ActualUserIsJuez = true;
          }
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
      let url = `http://${environment.apiUrl}:3000/api/submission/get-submission-name/${this.game}`;
      this.gameParameter = this.game;
      if(this.id){
        url = `http://${environment.apiUrl}:3000/api/submission/get-submission-site/${this.game}`;
      }
      
      this.SubmissionService.getSubmissionName(url).subscribe(
        (game: Submission) => {
          this.gameLink = game.game;
          this.pitchLink = game.pitch;
          this.gameTitle = game.title;
          this.gameDescription = game.description;
          const urlj = `http://${environment.apiUrl}:3000/api/team/get-team/${game.teamId}`;
          this.TeamService.getTeamById(urlj).subscribe(
            (team: Team) => {
              this.teamName = team.studioName;
              this.gameDescription = game.description;
              this.teamMembers = team.jammers.map(jammer => ({
                name: jammer.name,
                discordUsername: jammer.discordUsername,
                email: jammer.email
              }));
              const urlc = `http://${environment.apiUrl}:3000/api/category/get-category/${game.categoryId}`;
              this.CategoryService.getCategory(urlc).subscribe(
                (category: Category) => {
                  this.categories = [category.titleEN];
                  const urlt = `http://${environment.apiUrl}:3000/api/theme/get-theme/${game.themeId}`;
                  this.ThemeService.getTheme(urlt).subscribe(
                    (theme: Theme) => { 
                      this.themes = theme.titleEN !== undefined ? [theme.titleEN] : [];
                      this.dataSource = {
                        name: this.gameTitle,
                        team: this.teamName,
                        description: this.gameDescription,
                        teamMembers: this.teamMembers,
                        themes: this.themes,
                        categories: this.categories,
                        gameLink: this.gameLink,
                        pitchLink: this.pitchLink
                      };
                    },
                    error => {
                      console.error('Error al obtener el tema:', error);
                    }
                  );
                },
                error => {
                  console.error('Error al obtener la categoría:', error);
                }
              );
            },
            error => {
              console.error('Error al obtener el equipo:', error);
            }
          );
        },
        error => {
          console.error('Error al obtener la entrega:', error);
        }
      );
    });
  }  
}
