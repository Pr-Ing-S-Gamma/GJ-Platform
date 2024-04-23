import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Country, Region, Site } from '../../../types';
import { RegionService } from '../../services/region.service';
import { SiteService } from '../../services/site.service';
declare var $: any;

@Component({
  selector: 'app-site-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './site-crud.component.html',
  styleUrl: './site-crud.component.css'
})
export class SiteCrudComponent implements OnInit {
  myForm!: FormGroup;
  dataSource: Site[] = [];
  regions: Region[] = [];
  countries: Country[] = [];

  siteToEdit: any;
  indexSite = 0;
  constructor(private fb: FormBuilder, private siteService: SiteService, private regionService: RegionService){}
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required]
    });
    this.regionService.getRegions('http://149.130.176.112:3000/api/region/get-regions')
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
    this.siteService.getCountries('http://149.130.176.112:3000/api/site/get-countries')
    .subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        console.error('Error al obtener países:', error);
      }
    );
    this.siteService.getSites('http://149.130.176.112:3000/api/site/get-sites')
    .subscribe(
      sites => {
        this.dataSource = sites;
      },
      error => {
        console.error('Error al obtener países:', error);
      }
    );
  }

  seleccionarElemento(elemento: any) {
    this.siteToEdit = elemento;
    this.indexSite = this.dataSource.indexOf(elemento);

    const selectedRegion = this.regions.find(region => region._id === elemento.region._id);
    const selectedCountry = this.countries.find(country => country.name === elemento.country.name);

    this.myForm.patchValue({
      name: elemento.name,
      region: selectedRegion, 
      country: selectedCountry 
    });
  }

  editar() {
    if (this.myForm.valid) {
      
      const siteId = this.siteToEdit['_id'];
      
      const url = `http://149.130.176.112:3000/api/site/update-site/${siteId}`;
      
      console.log(this.myForm.value["country"].name);
      this.siteService.updateSite(url, {
        name: this.myForm.value["name"],
        region: this.myForm.value["region"],
        country: this.myForm.value["country"].name
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexSite] = {
            _id: siteId,
            name: this.myForm.value["name"],
            region: this.myForm.value["region"],
            country: this.myForm.value["country"]
          };
          this.showSuccessMessage('Site updated successfully!');
        },
        error: (error) => {
          console.error('Error al actualizar el site:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://149.130.176.112:3000/api/site/delete-site/${id}`;

    this.siteService.deleteSite(url).subscribe({
        next: (data) => {
            console.log('Site eliminado correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar la categoría:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }

  agregar() {
    if (this.myForm.valid) {
      this.siteService.createSite(`http://149.130.176.112:3000/api/site/create-site`, {
        name: this.myForm.value["name"],
        region: this.myForm.value["region"],
        country: this.myForm.value["country"].name
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const siteId = data.siteId;
            this.dataSource.push({ _id: siteId, name: this.myForm.value["name"], region: this.myForm.value["region"], country: this.myForm.value["country"]});
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

successMessage: string = '';
errorMessage: string = '';

showSuccessMessage(message: string) {
  this.successMessage = message;
  setTimeout(() => {
    this.successMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
  }, 5000); // Limpia el mensaje después de 5 segundos
}

showErrorMessage(message: string) {
  this.errorMessage = message;
  setTimeout(() => {
    this.errorMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
  }, 5000); // Limpia el mensaje después de 5 segundos
}
  
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual

  // Función para cambiar de página
  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  // Función para obtener los datos de la página actual
  obtenerDatosPagina() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.dataSource.length);
    return this.dataSource.slice(startIndex, endIndex);
  }

  get paginasMostradas(): (number | '...')[] {
    const totalPaginas = this.totalPaginas;
    const currentPage = this.currentPage;
    const paginasMostradas: (number | '...')[] = [];

    const rango = 2; // Cambia esto para ajustar el número de páginas mostradas

    let inicio = Math.max(1, currentPage - rango);
    let fin = Math.min(totalPaginas, currentPage + rango);

    for (let i = inicio; i <= fin; i++) {
      paginasMostradas.push(i);
    }

    if (inicio == 1){
      switch(fin - inicio){
        case 2:
          paginasMostradas.push(4);
          paginasMostradas.push(5);
          break;
        case 3:
          paginasMostradas.push(5);
          break;
        default: break;
      }
    }
    if (fin == totalPaginas){
      switch(fin - inicio){
        case 2:
          paginasMostradas.unshift(totalPaginas-4, totalPaginas-3);
          break;
        case 3:
          paginasMostradas.unshift(totalPaginas-4);
          break;
        default: break;
      }
    }
    return paginasMostradas;
}

  ventanaAgregar: boolean = false;
}
