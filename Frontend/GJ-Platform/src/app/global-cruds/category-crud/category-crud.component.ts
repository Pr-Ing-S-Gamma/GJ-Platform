import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
  dataSource = [
    { id: 1, Category: 'RPG' },
    { id: 2, Category: 'Gacha' },
    { id: 3, Category: 'Battle Royale' }
  ];

  CategoryToEdit: any;
  indexCategory = 0;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      category: ['', Validators.required]
    });
  }
  seleccionarElemento(elemento:any){
    let categoryEditInput = document.getElementById('categoryEditInput') as HTMLInputElement;
    this.CategoryToEdit = elemento;
    this.indexCategory = this.dataSource.indexOf(elemento);
    categoryEditInput.value = this.CategoryToEdit["Category"]; 
  }

  // Aquí puedes agregar la lógica para editar y eliminar elementos
editar() {
  if (this.myForm.valid) {
    console.log('Formulario válido');
    console.log('Valores del formulario:', this.myForm.value);
    
    // Lógica para enviar el formulario aquí

    this.dataSource[this.indexCategory].Category = this.myForm.value.category; // Corregir la asignación aquí
    this.showSuccessMessage("Success!");
  } else {
    console.log('Formulario inválido');
  }
}

  eliminar(elemento: any) {
    // Lógica para enviar el formulario aquí
    this.dataSource = this.dataSource.filter(i => i !== elemento)
  }

  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);

      // Lógica para enviar el formulario aquí

      this.dataSource.push({id: 0, Category: this.myForm.value["category"]})
      this.showSuccessMessage("Success!")
    } else {
      console.log('Formulario inválido');
    }
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  successMessage: string = '';

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
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
