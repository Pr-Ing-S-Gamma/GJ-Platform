import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-information',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game-information.component.html',
  styleUrl: './game-information.component.css'
})
export class GameInformationComponent {
  @Input() game!: string;
  gameParameter!: String;
  constructor(private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameParameter = params['game'];
    });
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
