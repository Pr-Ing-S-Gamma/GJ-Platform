import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-global-site-information',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './global-site-information.component.html',
  styleUrl: './global-site-information.component.css'
})
export class GlobalSiteInformationComponent {
  regionParameter!: String;
  siteParameter!: String;
  constructor(private router: Router, private route: ActivatedRoute) { }

  moveToCruds() {
    this.router.navigate(['/DataManagement']);
  }

  moveToRegionSites(region: String){
    this.router.navigate(['/Sites', region]);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.regionParameter = params['region'];
        // Aquí podrías realizar lógica adicional para cargar datos basados en el nombre
      this.siteParameter = params['site'];
        // Aquí podrías realizar lógica adicional para cargar datos basados en el nombre
    });
  }

  staff = [
    {name: 'David', role: 'Jammer', email: 'xdavidpastor@gmail.com'},
    {name: 'Rodolfo', role: 'Local Organizer', email: 'fenrirson@gmail.com'},
    {name: 'Luis', role: 'Assistant', email: 'producer@gmail.com'},
    {name: 'Atlas', role: 'Jammer', email: 'xXxAtlas09xXx@gmail.com'}
  ]

  games = [
    {name: 'Bloom Tales', team: 'Outlander studio'},
    {name: 'Space Pinbam', team: 'Flipper Studio'}
  ]

}
