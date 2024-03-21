import { Component, OnInit} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-global-sites',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './global-sites.component.html',
  styleUrl: './global-sites.component.css'
})

export class GlobalSitesComponent implements OnInit{
  regionParameter: String | undefined;
  constructor(private router: Router, private route: ActivatedRoute) { }

  moveToCruds() {
    this.router.navigate(['/DataManagement']);
  }

  moveToRegionsRoot(){
    this.router.navigate(['/Sites']);
  }

  moveToRegionSites(region: String){
    this.router.navigate(['/Sites', region]);
  }

  moveToSiteInformation(site: String){
    this.router.navigate(['/Sites', this.regionParameter, 'Information', site]);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['region']) {
        this.regionParameter = params['region'];
        // Aquí podrías realizar lógica adicional para cargar datos basados en el nombre
      } else {
        // Manejo del parámetro vacío
        this.regionParameter = 'Regions';
      }
    });
  }

  regions = [
    { name: 'LATAM', sites: [
      {country: 'Costa Rica', name:'Zapote'},
      {country: 'Argentina', name:'El BICHO'},
      {country: 'México', name: 'Nahui Mictlan'}
    ]},
    { name: 'Brazil', sites: [
      {country: 'Brazil', name:'Sopa du Macaco'}
    ]},
    { name: 'Fate', sites: [
      {country: 'Japón', name: 'Fuyuki'},
      {country: '?', name: 'Chaldea'},
      {country: 'Inglaterra', name:'Clock Tower'},
      {country: 'Babylonia', name: 'Ur'}
    ]}
  ]

}
