import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../types';
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomAlertComponent } from '../../jammer-home/custom-alert/custom-alert.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-category-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-crud.component.html',
  styleUrl: './category-crud.component.css'
})
export class CategoryCrudComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: Category[] = [];

  CategoryToEdit: any;
  indexCategory = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  constructor(private dialog: MatDialog, private fb: FormBuilder, private categoryService: CategoryService){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      titleSP: ['', Validators.required],
      titleEN: ['', Validators.required],
      titlePT: ['', Validators.required],
      descriptionSP: ['', Validators.required],
      descriptionEN: ['', Validators.required],
      descriptionPT: ['', Validators.required],
      manualSP: ['', Validators.required],
      manualEN: ['', Validators.required],
      manualPT: ['', Validators.required]
    });
  
    const url = 'http://localhost:3000/api/category/get-categories';
    this.categoryService.getCategories(url).subscribe(
      (categories: any[]) => {
        this.dataSource = categories.map(category => ({
          _id: category._id,
          titleSP: category.titleSP,
          titleEN: category.titleEN,
          titlePT: category.titlePT,
          descriptionSP: category.descriptionSP,
          descriptionEN: category.descriptionEN,
          descriptionPT: category.descriptionPT,
          manualSP: category.manualSP,
          manualEN: category.manualEN,
          manualPT: category.manualPT
        }));
      },
      error => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }
  showAlert(message: string, callback: () => void): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, {
      width: '400px',
      data: { message: message }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        callback();
      }
    });
  }
  
  selectedColumns: (keyof Category)[] = []; 

  exportToPDF() {
    const doc = new jsPDF();
  
    const url = 'http://localhost:3000/api/category/get-categories';
    this.categoryService.getCategories(url).subscribe(
      (categories: any[]) => {
        const data = categories.map(category => ({
          _id: category._id,
          titleSP: category.titleSP,
          titleEN: category.titleEN,
          titlePT: category.titlePT,
          descriptionSP: category.descriptionSP,
          descriptionEN: category.descriptionEN,
          descriptionPT: category.descriptionPT,
          manualSP: category.manualSP,
          manualEN: category.manualEN,
          manualPT: category.manualPT
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
  
        doc.save('categories.pdf');
      },
      error => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }
  
  
  
  seleccionarElemento(elemento: any) {
    this.CategoryToEdit = elemento;
    this.indexCategory = this.dataSource.indexOf(elemento);
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
    if (this.myForm.valid) {
      const categoryId = this.CategoryToEdit['_id'];
      const url = `http://localhost:3000/api/category/update-category/${categoryId}`;
  
      this.categoryService.updateCategory(url, {
        titleSP: this.myForm.value['titleSP'],
        titleEN: this.myForm.value['titleEN'],
        titlePT: this.myForm.value['titlePT'],
        descriptionSP: this.myForm.value['descriptionSP'],
        descriptionEN: this.myForm.value['descriptionEN'],
        descriptionPT: this.myForm.value['descriptionPT'],
        manualSP: this.myForm.value['manualSP'],
        manualEN: this.myForm.value['manualEN'],
        manualPT: this.myForm.value['manualPT']
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexCategory] = {
            _id: categoryId,
            titleSP: this.myForm.value['titleSP'],
            titleEN: this.myForm.value['titleEN'],
            titlePT: this.myForm.value['titlePT'],
            descriptionSP: this.myForm.value['descriptionSP'],
            descriptionEN: this.myForm.value['descriptionEN'],
            descriptionPT: this.myForm.value['descriptionPT'],
            manualSP: this.myForm.value['manualSP'],
            manualEN: this.myForm.value['manualEN'],
            manualPT: this.myForm.value['manualPT']
          };
          this.showAlert("Agregado con éxito", () => {
            window.location.reload();
          });
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
  
    const url = `http://localhost:3000/api/category/delete-category/${id}`;
  
    this.categoryService.deleteCategory(url).subscribe({
      next: (data) => {
        console.log('Categoría eliminada correctamente:', data);
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
      const newCategory = {
        titleSP: this.myForm.value['titleSP'],
        titleEN: this.myForm.value['titleEN'],
        titlePT: this.myForm.value['titlePT'],
        descriptionSP: this.myForm.value['descriptionSP'],
        descriptionEN: this.myForm.value['descriptionEN'],
        descriptionPT: this.myForm.value['descriptionPT'],
        manualSP: this.myForm.value['manualSP'],
        manualEN: this.myForm.value['manualEN'],
        manualPT: this.myForm.value['manualPT']
      };
  
      this.categoryService.createCategory(`http://localhost:3000/api/category/create-category`, newCategory)
        .subscribe({
          next: (data) => {
            console.log(data);
            if (data.success) {
              const newCategoryWithId: Category = {
                ...newCategory,
                _id: data.categoryId 
              };
              this.dataSource.push(newCategoryWithId);
              this.showSuccessMessage(data.msg);
            } else {
              this.showErrorMessage(data.error);
            }
          },
          error: (error) => {
            console.error(error);
            this.showErrorMessage(error.error.error);
          },
        });
    } else {
      console.error('Formulario enviado:', this.myForm.value);
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
            return item[this.selectedHeader].toLowerCase().startsWith(filterText);
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
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
