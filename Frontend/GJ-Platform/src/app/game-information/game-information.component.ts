import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Category, Team, Theme } from '../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmissionService } from '../services/submission.service';
import { RateFormComponent } from './rate-form/rate-form.component';
import { Submission } from '../../types';
import { TeamService } from '../services/team.service';
import { ThemeService } from '../services/theme.service';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private SubmissionService: SubmissionService,
    private TeamService: TeamService,
    private ThemeService: ThemeService,
    private CategoryService: CategoryService
  ) { }
  
  ngOnInit(): void {
    const url = 'http://localhost:3000/api/submission/get-submission/' + this.game;

    this.http.get<Submission>(url).subscribe(
      (game: Submission) => {
        const teamUrl = 'http://localhost:3000/api/team/get-team/' + game.teamId;
        const categoryUrl = 'http://localhost:3000/api/category/get-category/' + game.categoryId;
        const themeUrl = 'http://localhost:3000/api/theme/get-theme/' + game.themeId;

        this.http.get<Team>(teamUrl).subscribe(
          (team: Team) => {
            this.http.get<Category>(categoryUrl).subscribe(
              (categories: Category) => {
                this.http.get<Theme>(themeUrl).subscribe(
                  (themes: Theme) => {
                    this.dataSource = {
                      name: game.title,
                      team: team.studioName,
                      description: game.description,
                      teamMembers: team.jammers,
                      themes: [themes.descriptionEN], //cambiar por una lista
                      categories: [categories.name], //cambiar por una lista
                      gameLink: game.game,
                      pitchLink: game.pitch
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
        console.error('Error al obtener el juego:', error);
      }
    );
  }
}
