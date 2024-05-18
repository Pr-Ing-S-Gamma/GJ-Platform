import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../../types';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  selectedHeader: string | undefined;
  filterValue: string = '';
  selectedColumns: (keyof Theme)[] = []; 

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
  getPdf(themeId: string, language: string): void {
    this.themeService.getPdf(themeId!, language!).subscribe(
        (pdfBlob: Blob) => {
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url);
        },
        (error) => {
            console.error('Error fetching PDF:', error);
        }
    );
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

successMessage: string = '';
errorMessage: string = '';

showSuccessMessage(message: string) {
  this.successMessage = message;
}

showErrorMessage(message: string) {
  this.errorMessage = message;
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
    let filteredData = this.dataSource;
  
    if (this.selectedHeader !== undefined && this.filterValue.trim() !== '') {
      const filterText = this.filterValue.trim().toLowerCase();
      filteredData = filteredData.filter(item => {
        switch (this.selectedHeader) {
          case '_id':
            return item._id && item._id.toLowerCase().startsWith(filterText);
          case 'titleSP':
          case 'titleEN':
          case 'titlePT':
          case 'descriptionSP':
          case 'descriptionEN':
          case 'descriptionPT':
          case 'manualSP':
          case 'manualEN':
          case 'manualPT':
            if (item[this.selectedHeader]) {
              return item[this.selectedHeader].toLowerCase().startsWith(filterText);
            }
            return false;
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
}


  exportToPDF() {
    const doc = new jsPDF();
  
    const url = 'http://localhost:3000/api/theme/get-themes';
    this.themeService.getThemes(url).subscribe(
      (themes: any[]) => {
        const data = themes.map(theme => ({
          _id: theme._id,
          titleSP: theme.titleSP,
          titleEN: theme.titleEN,
          titlePT: theme.titlePT,
          descriptionSP: theme.descriptionSP,
          descriptionEN: theme.descriptionEN,
          descriptionPT: theme.descriptionPT,
          manualSP: theme.manualSP,
          manualEN: theme.manualEN,
          manualPT: theme.manualPT
        }));
  
        const selectedData = data.map(row => {
          const rowData: any[] = [];
          this.selectedColumns.forEach(column => {
            if (column === '_id') {
              rowData.push(row[column] || ''); 
            } else {
              rowData.push(row[column] || ''); 
            }
          });
          return rowData;
        });
  
        const headers = this.selectedColumns.map(column => {
            return column.replace(/[A-Z]/g, ' $&').toUpperCase();
        });
  
        autoTable(doc, {
          head: [headers],
          body: selectedData
        });
  
        doc.save('themes.pdf');
      },
      error => {
        console.error('Error al obtener themes:', error);
      }
    );
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
