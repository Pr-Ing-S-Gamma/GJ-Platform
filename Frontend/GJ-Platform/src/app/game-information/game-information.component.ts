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
export class GameInformationComponent {
  @Input() game!: string;
  gameParameter!: string;
  ActualUserIsJuez: Boolean = true;
  evaluando: Boolean = false;
  dataSource: any = null;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private SubmissionService: SubmissionService, private TeamService: TeamService, private ThemeService: ThemeService, private CategoryService: CategoryService) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      var url = 'http://localhost:3000/api/submission/get-submission/' + this.game;
      console.log("id du jogo " + this.game)
      this.SubmissionService.getSubmission(url).subscribe(
          (game: Submission) => {
              const urlj = 'http://localhost:3000/api/team/get-team/' + game.teamId
              console.log("id du temu " +  game.teamId)
              this.TeamService.getTeamById(urlj).subscribe(
                  (team: Team) => {
                      const urlc = 'http://localhost:3000/api/category/get-category/' + game.categoryId
                      console.log("id du catgpsijfa " +  game.categoryId)
                      this.CategoryService.getCategory(urlc).subscribe(
                          (categories: Category) => {
                              const urlt = 'http://localhost:3000/api/theme/get-theme/' + game.themeId
                              console.log("id du tema " + game.themeId)
                              this.ThemeService.getTheme(urlt).subscribe(
                                  (themes: Theme) => {
                                      console.log("entré")
                                      this.dataSource = {
                                          name: game.title,
                                          team: team.studioName,
                                          description: game.description,
                                          teamMembers: team.jammers,
                                          themes: [themes.descriptionEN], //cambiar por una lista
                                          categories: [categories.name], //cambiar por una lista
                                          gameLink: game.game,
                                          pitchLink: game.pitch
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

}
