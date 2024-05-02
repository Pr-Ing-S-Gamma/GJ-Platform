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
  teamMembers: string[] = [];
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
      var url = 'http://localhost:3000/api/submission/get-submission/' + this.game;
      console.log("id del juego " + this.game)
      this.SubmissionService.getSubmission(url).subscribe(
        (game: Submission) => {
          console.log("id del juego " + game)
          const urlj = 'http://localhost:3000/api/team/get-team/' + game.teamId
          console.log("id del equipo " +  game.teamId)
          this.TeamService.getTeamById(urlj).subscribe(
            (team: Team) => {
              const urlc = 'http://localhost:3000/api/category/get-category/' + game.categoryId
              console.log("id de la categoría " +  game.categoryId)
              this.CategoryService.getCategory(urlc).subscribe(
                (categories: Category) => {
                  const urlt = 'http://localhost:3000/api/theme/get-theme/' + game.themeId
                  console.log("id del tema " + game.themeId)
                  this.ThemeService.getTheme(urlt).subscribe(
                    (themes: Theme) => {
                      console.log("entré", team)
                      // Guardar los valores en variables
                      this.gameTitle = game.title;
                      this.teamName = team.studioName;
                      this.gameDescription = game.description;
                      this.teamMembers = team.jammers.map(jammer => jammer.name)
                      if(Array.isArray(themes) && themes.length > 0) {
                        this.themes = themes.map(theme => theme.descriptionEN || '');
                      } else {
                        this.themes = [];
                      }

                      this.categories = [categories.name]; //cambiar por una lista
                      this.gameLink = game.game;
                      this.pitchLink = game.pitch;
                      
                      // Asignar valores a dataSource
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

  
  /*
  dataSource = {
    name: 'Bloom Tales',
    team: 'Outlander Studio',
    description: '"Bloom Tales" is an exhilarating fusion of roguelike, platformer, and dungeon crawler elements, It features a set of basic actions: jumping, dashing, attacking, and interacting, which, when combined, create dynamic and engaging gameplay. As a sentient plant, you will explore this dystopian world through a slick 3D isometric lens, with the mission to regrow the sacred tree of this Island and unravel ancient mysteries.',
    teamMembers: [
      {name: 'David', email: 'xdavidpastor@gmail.com'},
      {name: 'Atlas', email: 'xXxAtlas09xXx@gmail.com'}
    ],
    themes: ['Blanket', 'plant', 'classic'],
    categories: ['3D'],
    gameLink: 'https://johnyvrvr.itch.io/bloom-tales',
    pitchLink: 'https://youtu.be/qs087tnc4y8'
  }
  */

