import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../types';
import { environment } from '../../../environments/environment.prod';
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

  constructor(private fb: FormBuilder, private categoryService: CategoryService){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      category: ['', Validators.required]
    });
    const url = '${environment.apiUrl}/category/get-categories';
    this.categoryService.getCategories(url).subscribe(
      (categories: any[]) => {
        this.dataSource = categories.map(category => ({ _id: category._id, name: category.name }));
      },
      error => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }
  seleccionarElemento(elemento:any){
    let categoryEditInput = document.getElementById('categoryEditInput') as HTMLInputElement;
    this.CategoryToEdit = elemento;
    this.indexCategory = this.dataSource.indexOf(elemento);
    categoryEditInput.value = this.CategoryToEdit["name"]; 
  }

  editar() {
    if (this.myForm.valid) {
      
      const categoryId = this.CategoryToEdit['_id'];
      
      const url = `${environment.apiUrl}/category/update-category/${categoryId}`;
  
      this.categoryService.updateCategory(url, {
        name: this.myForm.value['category']
      }).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.dataSource[this.indexCategory] = {
            _id: categoryId,
            name: this.myForm.value['category'] 
          };
          this.showSuccessMessage('Category updated successfully!');
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

    const url = `${environment.apiUrl}/category/delete-category/${id}`;

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
      var categoryName = this.myForm.value["category"];
      this.categoryService.createCategory(`${environment.apiUrl}/category/create-category`, {
        name: categoryName,
      }).subscribe({
        next: (data) => {
          console.log(data);
          if (data.success) {
            const categoryId = data.categoryId;
            this.dataSource.push({ _id: categoryId, name: this.myForm.value["category"] });
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          console.log(error);
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
