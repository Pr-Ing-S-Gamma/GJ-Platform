import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Category, Team, Theme } from '../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmissionService } from '../services/submission.service';
import { RateFormComponent } from './rate-form/rate-form.component';
import { Submission } from '../../types';
import { TeamService } from '../services/team.service';
import { ThemeService } from '../services/theme.service';
import { CategoryService } from '../services/category.service';

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
  ActualUserIsJuez: Boolean = true;
  evaluando: Boolean = false;
  dataSource: any = null;
  gameTitle: string = '';
  teamName: string = '';
  gameDescription: string = '';
  teamMembers: { name: string; discordUsername: string; email: string; }[] = [];
  themes: string[] = [];
  categories: string[] = [];
  gameLink: string = '';
  pitchLink: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private SubmissionService: SubmissionService, 
    private TeamService: TeamService, 
    private ThemeService: ThemeService, 
    private CategoryService: CategoryService
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameParameter = this.game;
      var url = 'http://localhost:3000/api/submission/get-submission/' + this.game;
      console.log("id del juego " + this.game)
      this.SubmissionService.getSubmission(url).subscribe(
        (game: Submission) => {
          this.gameLink = game.game;
          this.pitchLink = game.pitch;
          this.gameTitle = game.title;
          this.gameDescription = game.description;
          console.log("id del juego " + game)
          const urlj = 'http://localhost:3000/api/team/get-team/' + game.teamId
          console.log("id del equipo " +  game.teamId)
          this.TeamService.getTeamById(urlj).subscribe(
            (team: Team) => {
              this.teamName = team.studioName;
              this.gameDescription = game.description;
              this.teamMembers = team.jammers.map(jammer => ({
                name: jammer.name,
                discordUsername: jammer.discordUsername,
                email: jammer.email
            }));
              const urlc = 'http://localhost:3000/api/category/get-category/' + game.categoryId
              console.log("id de la categoría " +  game.categoryId)
              this.CategoryService.getCategory(urlc).subscribe(
                (categories: Category) => {
                  this.categories = [categories.titleEN];
                  const urlt = 'http://localhost:3000/api/theme/get-theme/' + game.themeId
                  console.log("id del tema " + game.themeId)
                  this.ThemeService.getTheme(urlt).subscribe(
                    (themes: Theme) => {
                      this.themes = ["Trains"]
                      this.dataSource = {
                        name: this.gameTitle,
                        team: this.teamName,
                        description: this.gameDescription,
                        teamMembers: this.teamMembers,
                        themes: this.themes,
                        categories: this.categories,
                        gameLink: this.gameLink,
                        pitchLink: this.pitchLink
                      }
                      console.log(this.dataSource)
                    },
                    error => {
                      console.error('Error al obtener juegos:', error);
                    }
                  )
                },
                error => {
                  console.error('Error al obtener juegos:', error);
                }
              )
            },
            error => {
              console.error('Error al obtener juegos:', error);
            }
          )
        },
        error => {
          console.error('Error al obtener juegos:', error);
        }
      )
    });
  }  
}