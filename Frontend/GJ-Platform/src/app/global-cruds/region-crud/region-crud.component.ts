import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegionService } from '../../services/region.service';
import { Region } from '../../../types';
declare var $: any;

@Component({
  selector: 'app-region-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './region-crud.component.html',
  styleUrl: './region-crud.component.css'
})
export class RegionCRUDComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: Region[] = [];
  
  regionToEdit: any;
  indexRegion = 0;
  constructor(private fb: FormBuilder, private regionService: RegionService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      region: ['', Validators.required]
    });
    const url = 'http://localhost:3000/api/region/get-regions';
    this.regionService.getRegions(url).subscribe(
      (regions: any[]) => {
        this.dataSource = regions.map(region => ({ _id: region._id, name: region.name }));
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }

  seleccionarElemento(elemento:any){
    let regionEditInput = document.getElementById('regionEditInput') as HTMLInputElement;
    this.regionToEdit = elemento
    this.indexRegion =this.dataSource.indexOf(elemento)
    regionEditInput.value = this.regionToEdit["name"];
  }

  editar() {
    if (this.myForm.valid) {
      const regionId = this.regionToEdit['_id'];
  
      const url = `http://localhost:3000/api/region/update-region/${regionId}`;
  
      this.regionService.updateRegion(url, {
        name: this.myForm.value['region']
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexRegion] = {
            _id: regionId,
            name: this.myForm.value['region'] 
          };
          this.showSuccessMessage('Region updated successfully!');
        },
        error: (error) => {
          console.error('Error al actualizar la región:', error);
          this.showErrorMessage(error.error.error);
        }
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://localhost:3000/api/region/delete-region/${id}`;

    this.regionService.deleteRegion(url).subscribe({
        next: (data) => {
            console.log('Region eliminada correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar el elemento:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }

  agregar() {
    if (this.myForm.valid) {
      var regionName = this.myForm.value["region"];
      this.regionService.createRegion(`http://localhost:3000/api/region/create-region`, {
        name: regionName,
      }).subscribe({
        next: (data) => {
          console.log(data);
          if (data.success) {
            const regionId = data.regionId; // Obtén el ID de la región creada desde la respuesta
            this.dataSource.push({ _id: regionId, name: this.myForm.value["region"] });
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          console.log(error);
          this.showErrorMessage(error.error.error); // Mostrar el mensaje de error del backend
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
    return this.dataSource.slice(startIndex, startIndex + this.pageSize);
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
  
    if (currentPage - inicio > rango) {
      paginasMostradas.unshift('...');
    }
    
    if (fin < totalPaginas - 1) {
      paginasMostradas.push('...');
    }
  
    return paginasMostradas;
  }

  ventanaAgregar: boolean = false;
}
