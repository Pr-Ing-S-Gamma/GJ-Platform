import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { Region, Site } from '../../types';
import { RegionService } from '../services/region.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  myForm!: FormGroup;
  regions: Region[] = [];
  sites: Site[] = [];

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private siteService: SiteService, private regionService: RegionService) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      region: ['', Validators.required],
      site: ['', Validators.required]
    });
    this.regionService.getRegions('http://localhost:3000/api/region/get-regions')
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }
  onRegionSelection() {
    const selectedValue = this.myForm.get('region')?.value;
    if (selectedValue && selectedValue._id) {
      this.siteService.getSitesPerRegion(`http://localhost:3000/api/site/get-sites-per-region/${selectedValue._id}`)
        .subscribe(
          sites => {
            this.sites = sites;

            if (this.sites.length > 0) {
              this.myForm.get('site')?.setValue(this.sites[0]);
            }
          },
          error => {
            console.error('Error al obtener sitios:', error);
          }
        );
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }
  
  submitForm() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      
      var formulario = this.myForm.value;
      var email = formulario.email;
      var name = formulario.name;
      var region = formulario.region;
      var site = formulario.site;

      this.userService.registerUser(`http://localhost:3000/api/user/register-user`, {
        name: name,
        email: email,
        regionId: region._id,
        siteId: site._id,
        rol: 'Jammer',
        coins: 0
      }).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
 