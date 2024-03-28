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
  showModal: boolean = false;
  showError: boolean = false;
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
            console.error('Error al obtener sites:', error);
          }
        );
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }
  
  submitForm() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      
      const { email, name, region, site} = this.myForm.value;
  
      this.userService.registerUser(`http://localhost:3000/api/user/register-user`, {
        name: name,
        email: email,
        region: {
          _id: region._id,
          name: region.name
        },
        site: {
          _id: site._id,
          name: site.name
        },
        rol: 'Jammer',
        coins: 0
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.showModal = true;
          } else {
            this.showErrorMessage('JKLASDJLKASDLKJ');
          }
        },
        error: (error) => {
          console.log(error);
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill all the fields.');
    }
  }

  redirectToLogin() {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
  errorMessage: string = '';
  
  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
    }, 5000); // Limpia el mensaje después de 5 segundos
  }

}
 