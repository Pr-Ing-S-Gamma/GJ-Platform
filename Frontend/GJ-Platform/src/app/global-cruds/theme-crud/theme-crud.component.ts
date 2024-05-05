import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../../types';
declare var $: any;

@Component({
  selector: 'app-theme-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './theme-crud.component.html',
  styleUrl: './theme-crud.component.css'
})
export class ThemeCrudComponent implements OnInit{

  myForm!: FormGroup;
  dataSource: Theme[] = [];

  ThemeToEdit: any;
  indexTheme = 0;

  constructor(private fb: FormBuilder, private themeService: ThemeService){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      titleEN: ['', Validators.required],
      titleSP: ['', Validators.required],
      titlePT: ['', Validators.required],
      descriptionEN: ['', Validators.required],
      descriptionSP: ['', Validators.required],
      descriptionPT: ['', Validators.required],
      manualEN: ['', Validators.required],
      manualSP: ['', Validators.required],
      manualPT: ['', Validators.required]
    });
    this.themeService.getThemes('http://localhost:3000/api/theme/get-themes')
      .subscribe(
        themes => {
          this.dataSource = themes;
        },
        error => {
          console.error('Error al obtener temas:', error);
        }
      );
  }

  seleccionarElemento(elemento: any) {
    this.ThemeToEdit = elemento;
    this.indexTheme = this.dataSource.indexOf(elemento);
    this.myForm.patchValue({
      titleEN: elemento.titleEN,
      titleSP: elemento.titleSP,
      titlePT: elemento.titlePT,
      descriptionEN: elemento.descriptionEN,
      descriptionSP: elemento.descriptionSP,
      descriptionPT: elemento.descriptionPT,
      manualEN: elemento.manualEN,
      manualSP: elemento.manualSP,
      manualPT: elemento.manualPT
    });
  }

  editar() {
    const themeId = this.ThemeToEdit['_id'];
    if (this.myForm.valid) {
      this.themeService.updateTheme(`http://localhost:3000/api/theme/update-theme/${themeId}`, this.myForm.value)
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.dataSource[this.dataSource.findIndex(theme => theme._id === data.theme._id)] = data.theme;
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

  eliminar(elemento: any) {
    const id = elemento._id;
    const url = `http://localhost:3000/api/theme/delete-theme/${id}`;
    this.themeService.deleteTheme(url).subscribe({
      next: (data) => {
        console.log('Tema eliminado correctamente:', data);
        this.dataSource = this.dataSource.filter(item => item !== elemento);
        this.showSuccessMessage(data.msg);
      },
      error: (error) => {
        console.error('Error al eliminar el tema:', error);
        this.showErrorMessage(error.error.msg);
      }
    });
  }

  agregar() {
    if (this.myForm.valid) {
      this.themeService.createTheme(`http://localhost:3000/api/theme/create-theme`, this.myForm.value)
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.dataSource.push(data.theme);
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
