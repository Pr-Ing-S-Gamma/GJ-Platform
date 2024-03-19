import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;


@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent implements OnInit{
  myForm!: FormGroup;
  dataSource = [
    { id: 1, name: 'Kung fury' , email: 'hackerman@gmail.com', role: 'GlobalOrganizer' },
    { id: 2, name: 'Tony Verceti' , email: 'Gobierno mundial', role: 'Jamer' },
    { id: 3, name: 'Guadalupe' , email: 'Costa Rica', role: 'LocalOrganizer' },
  ];
  roles = ['GlobalOrganizer', 'LocalOrganizer', 'Judge', 'Jamer']
  
  userToEdit : any;
  indexUser = 0
  constructor(private fb: FormBuilder){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  seleccionarElemento(elemento: any) {
    this.userToEdit = elemento;
    this.indexUser = this.dataSource.indexOf(elemento);
    this.myForm.patchValue({
      name: elemento.name,
      email: elemento.email,
      role: elemento.role
    });
  }

    editar() {
      if (this.myForm.valid) {
        console.log('Formulario válido');
        console.log('Valores del formulario:', this.myForm.value);
        this.dataSource[this.indexUser] = {
          id: this.userToEdit['id'],
          name: this.myForm.value['name'],
          email: this.myForm.value['email'],
          role: this.myForm.value['role'],
        }
        this.showSuccessMessage("Success!")
      } else {
        console.log('Formulario inválido');
      }
    }
    eliminar(elemento: any) {
      this.dataSource = this.dataSource.filter(i => i !== elemento);
    }
    agregar() {
      if (this.myForm.valid) {
        console.log('Formulario válido');
        console.log('Valores del formulario:', this.myForm.value)
        this.dataSource.push({
          id: this.dataSource.length + 1,
          name: this.myForm.value['name'],
          email: this.myForm.value['email'],
          role: this.myForm.value['role']
        })
        this.showSuccessMessage("Success!")
      } else {
        console.log('Formulario inválido');
      }
    }
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
