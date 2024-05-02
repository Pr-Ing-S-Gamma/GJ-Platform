import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../types';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmissionService } from '../services/submission.service';
import { RateFormComponent } from './rate-form/rate-form.component';
import { Submission } from '../../types';

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
  dataSvurce: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private SubmissionService: SubmissionService) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameParameter = params['game'];
    });
    var url = `http://localhost:3000/api/submission/get-submission/${this.gameParameter}`;
    this.SubmissionService.getSubmission(url).subscribe(
      (game: any) => {
        this.dataSource = game.map((submission: { _id: any; name: any; teamId: any; }) => ({
           _id: submission._id, name: submission.name, team: submission.teamId 
          }));
      },
      error => {
        console.error('Error al obtener juegos:', error);
      }
    )
  }
  
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

}
